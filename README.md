# InspireBud

InspireBud is an AI-powered creativity assistant designed to support writers, artists, and creators in their creative endeavors. It generates personalized prompts and suggestions, analyzes previous works, helps overcome creative blocks, and continuously learns and improves based on user feedback.

## Features

- **Personalized Prompts and Suggestions**: Generate customized prompts and suggestions tailored to your individual creative needs and preferences.
- **Overcoming Creative Blocks**: Offer alternative perspectives, brainstorming ideas, and suggest creative techniques to help overcome creative blocks.
- **Continuous Learning and Improvement**: Learn and adapt to your preferences and creative process over time, ensuring relevant and valuable assistance.
- **Integration and Accessibility**: Accessible through a web or mobile interface, with potential integration with popular creative software and platforms.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install InspireBud.

```bash
git clone https://github.com/mahak0711/inspirebud.git
cd inspirebud
npm install
```
# Usage
## Starting the Development Server

```bash
npm start
```
Open your browser and navigate to http://localhost:3000.

## Connecting Your Wallet
```bash
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

const connectWallet = async () => {
  try {
    let web3modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions
    });
    const web3modalInstance = await web3modal.connect();
    const web3modalProvider = new ethers.providers.Web3Provider(web3modalInstance);
    console.log(web3modalProvider);
    setConnected(true); // Update connected state
  } catch (error) {
    console.log('Error connecting wallet:', error);
  }
};
```
## Generating Suggestions
```bash 
import axios from 'axios';

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post('http://localhost:3001/generate', preferences);
    setSuggestions(response.data.suggestions);
  } catch (error) {
    console.error('Error generating suggestions:', error);
  } finally {
    setLoading(false);
  }
};
```
# Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


