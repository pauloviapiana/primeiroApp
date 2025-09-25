// Importações principais do React e React Native
import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView,} from 'react-native';

// Importa o AsyncStorage (banco de dados local do app)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente principal
export default function App() {
  // Estado que controla qual tela mostrar: "lista" ou "formulario"
  const [view, setView] = useState('lista');

  // Estado com a lista de receitas (array de objetos)
  const [recipes, setRecipes] = useState([]);

  // Estados para os campos do formulário
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');

  // Carrega receitas salvas ao abrir o app
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('@recipes');
        if (storedRecipes !== null) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (e) {
        console.error("Falha ao carregar receitas.", e);
      }
    };
    loadRecipes();
  }, []);

  // Salva automaticamente as receitas sempre que a lista mudar
  useEffect(() => {
    const saveRecipes = async () => {
      try {
        await AsyncStorage.setItem('@recipes', JSON.stringify(recipes));
      } catch (e) {
        console.error("Falha ao salvar receitas.", e);
      }
    };
    saveRecipes();
  }, [recipes]);

  // Função para adicionar uma nova receita
  const handleAddRecipe = () => {
    if (!title) return; // Ignora se o título estiver vazio

    const newRecipe = {
      id: Date.now().toString(),
      title,
      ingredients,
    };

    setRecipes(current => [...current, newRecipe]);

    // Limpa os inputs e volta para a tela de lista
    setTitle('');
    setIngredients('');
    setView('lista');
  };

  // Função para deletar uma receita
  const handleDeleteRecipe = (id) => {
    setRecipes(current => current.filter(recipe => recipe.id !== id));
  };

  // Renderização condicional: Lista ou Formulário
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Meu Livro de Receitas</Text>

        {view === 'lista' ? (
          <View>
            {/* Botão para abrir o formulário */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setView('formulario')}>
              <Text style={styles.buttonText}>Adicionar Nova Receita</Text>
            </TouchableOpacity>

            {/* Lista de receitas ou mensagem vazia */}
            {recipes.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
            ) : (
              recipes.map((item) => (
                <View key={item.id} style={styles.recipeItem}>
                  <View style={styles.recipeTextContainer}>
                    <Text style={styles.recipeTitle}>{item.title}</Text>
                    <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
                  </View>

                  {/* Botão de excluir */}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteRecipe(item.id)}>
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.formHeader}>Adicionar Receita</Text>

            {/* Input do título */}
            <TextInput
              style={styles.input}
              placeholder="Título da Receita"
              value={title}
              onChangeText={setTitle}
            />

            {/* Input dos ingredientes */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingredientes"
              value={ingredients}
              onChangeText={setIngredients}
              multiline={true}
            />

            {/* Botões do formulário */}
            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setView('lista')}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddRecipe}>
                <Text style={styles.buttonText}>Salvar</Text>
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
  // Formulário
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
  // Lista
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTextContainer: {
    flex: 1,
    marginRight: 15,
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
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
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
