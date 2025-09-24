import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {StyleSheet,Text,View,TextInput,TouchableOpacity,SafeAreaView,ScrollView} from 'react-native';

import { SafeAreaView } from 'react-native-web';

export default function App() {

  const [view, setView] = useState('lista');
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');

  //Efeito de Carregar as receitas do AsyncStorage quando o app inicia
  useEffect(()=>{
    const loadRecipes = async () => {
      try {
        //Tenta pegar o item salvo com a chave '@recipes
        const storedRecipes = await AsyncStorage.getItem('@recipes')
        //Se encontrou algo, atualiza nosso estado 'recipes' com os dados salvos

        if (storedRecipes !== null){
          setRecipes(JSON.parse(storedRecipes))
        }
      }
      catch (e){
        console.error("Falha ao carregar as receitas", e)
      }
    };
    loadRecipes();
  },[]);

  const handleAddRecipe = () => {

    if(!title){
      return
    }
  
    const newRecipe={
      id: Date.now().toString(),
      title: title,
      ingredients: ingredients,
    }
    
    setRecipes(currentRecipes => [...currentRecipes, newRecipe])
    setTitle("")
    setIngredients("")
    setView("lista")
  }

  const handleDeleteRecipe = (id) => {
    setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe.id !== id))
  }
}




  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={style.scrollContainer}>
        <Text style={styles.header}>
          Meu Livro de Receitas
        </Text>
        {view === 'lista'?(
          <View>
            <TouchableOpacity style={styles.addButton} onPress={() => setView('formulario')}>
              <Text style={styles.buttonText}>
                Adicionar nova Receita
              </Text>
            </TouchableOpacity>

            {recipes.length === 0 ?(
              <Text style={styles.emptyText}>
                Nenhuma Receita cadastrada
              </Text>
            ):(
              recipes.map((item) => (
                <View>
              ))
            )
            )}

          </View>
        )}
      </ScrollView>
      <View style={styles.container}>

        <Text>Fellenzao</Text>

        <StatusBar style="auto" />

      </View>
    </SafeAreaView>
  );


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
