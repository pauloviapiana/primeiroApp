import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // Qual tela mostrar: lista ou formulario
  const [view, setView] = useState('lista');

  // Lista de receitas
  const [recipes, setRecipes] = useState([]);

  // Campos do formulário
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [modoDePreparo, setModoDePreparo] = useState('');

  // Estado para saber se estou editando uma receita
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Carregar receitas ao iniciar
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('@recipes');
        if (storedRecipes !== null) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (e) {
        console.error('Falha ao carregar receitas.', e);
      }
    };
    loadRecipes();
  }, []);

  // Salvar receitas sempre que mudar
  useEffect(() => {
    const saveRecipes = async () => {
      try {
        await AsyncStorage.setItem('@recipes', JSON.stringify(recipes));
      } catch (e) {
        console.error('Falha ao salvar receitas.', e);
      }
    };
    saveRecipes();
  }, [recipes]);

  // Função para adicionar ou editar
  const handleSaveRecipe = () => {
    if (!title) return;

    if (editingRecipe) {
      // Atualizar receita existente
      setRecipes(current =>
        current.map(r =>
          r.id === editingRecipe.id
            ? { ...r, title, ingredients, modoDePreparo }
            : r
        )
      );
      setEditingRecipe(null);
    } else {
      // Criar nova receita
      const newRecipe = {
        id: Date.now().toString(),
        title,
        ingredients,
        modoDePreparo,
      };
      setRecipes(current => [...current, newRecipe]);
    }

    // Limpar inputs
    setTitle('');
    setIngredients('');
    setModoDePreparo('');
    setView('lista');
  };

  // Função para deletar
  const handleDeleteRecipe = id => {
    setRecipes(current => current.filter(recipe => recipe.id !== id));
  };

  // Função para editar
  const handleEditRecipe = recipe => {
    setEditingRecipe(recipe);
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setModoDePreparo(recipe.modoDePreparo);
    setView('formulario');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Meu Livro de Receitas</Text>

        {view === 'lista' ? (
          <View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setView('formulario')}>
              <Text style={styles.buttonText}>Adicionar Nova Receita</Text>
            </TouchableOpacity>

            {recipes.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
            ) : (
              recipes.map(item => (
                <View key={item.id} style={styles.recipeItem}>
                  <View style={styles.recipeTextContainer}>
                    <Text style={styles.recipeTitle}>{item.title}</Text>
                    <Text style={styles.recipeIngredients}>
                      Ingredientes: {item.ingredients}
                    </Text>
                    <Text style={styles.recipeIngredients}>
                      Modo de Preparo: {item.modoDePreparo}
                    </Text>
                  </View>

                  <View style={styles.recipeButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => handleEditRecipe(item)}>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteRecipe(item.id)}>
                      <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.formHeader}>
              {editingRecipe ? 'Editar Receita' : 'Adicionar Receita'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título da Receita"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingredientes"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Modo de Preparo"
              value={modoDePreparo}
              onChangeText={setModoDePreparo}
              multiline
            />

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setEditingRecipe(null);
                  setTitle('');
                  setIngredients('');
                  setModoDePreparo('');
                  setView('lista');
                }}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleSaveRecipe}>
                <Text style={styles.buttonText}>
                  {editingRecipe ? 'Salvar Alterações' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#e67e22',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  recipeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  recipeTextContainer: {
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeIngredients: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  recipeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#f39c12',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#95a5a6',
  },
});
