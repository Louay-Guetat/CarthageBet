const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.post('/saveData', async (req, res) => {
    const data = req.body;

    try {
        const filePath = path.join(__dirname, 'data.json');

        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        let dataArray = [];

        if (fileExists) {
            const fileData = await fs.readFile(filePath, 'utf8');
            dataArray = JSON.parse(fileData);
        }

        dataArray.push(data);

        await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2), 'utf8');

        res.send('Data appended successfully.');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/getdata', async (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      const dataArray = JSON.parse(fileData);
      res.send(dataArray);
    } catch (error) {
      console.error('Error reading data file:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/getHistory', async (req, res) => {
    const filePath = path.join(__dirname, 'done.json');
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      const dataArray = JSON.parse(fileData);
      res.send(dataArray);
    } catch (error) {
      console.error('Error reading data file:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/updateData', async (req, res) => {
    try {
      const updatedData = req.body;

      const originalData = JSON.parse(await fs.readFile('data.json', 'utf8'));
  
      const updatedIndices = updatedData.map((updatedItem) =>
        originalData.findIndex((originalItem) => originalItem.id === updatedItem.id)
      );
  
      updatedIndices.forEach((index) => originalData.splice(index, 1));

      const filePath = path.join(__dirname, 'done.json');
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

      let dataArray = [];

      if (fileExists) {
          const fileData = await fs.readFile(filePath, 'utf8');
          dataArray = JSON.parse(fileData);
      }
      dataArray.push(updatedData[0])
      await fs.writeFile('done.json', JSON.stringify(dataArray, null, 2));
  
      await fs.writeFile('data.json', JSON.stringify(originalData, null, 2));
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  app.get('/getUsers', async (req, res) => {
    const filePath = path.join(__dirname, 'users.json');
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      const dataArray = JSON.parse(fileData);
      res.send(dataArray);
    } catch (error) {
      console.error('Error reading data file:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/editWallet', async (req, res) => {
    try {
      const {username, wallet, name} = req.body;
      const filePath = path.join(__dirname, 'users.json');
      const fileData = await fs.readFile(filePath, 'utf8');
      const dataArray = JSON.parse(fileData);
      const index = dataArray.findIndex(item => item.username === username);
      if (index !== -1) {
        dataArray[index].wallets.map((w) => {
          if (w.name === name){
            w.number = wallet
          }
        })
        await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2));
  
        res.status(200).json({ success: true, message: 'Field updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Object not found' });
      }
    } catch (error) {
      console.error('Error updating field:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  app.post('/handleData', async (req, res) => {
    try {
      const updatedData = req.body;

      const originalData = JSON.parse(await fs.readFile('done.json', 'utf8'));
  
      const updatedIndices = updatedData.map((updatedItem) =>
        originalData.findIndex((originalItem) => originalItem.id === updatedItem.id)
      );
  
      updatedIndices.forEach((index) => originalData.splice(index, 1));

      const filePath = path.join(__dirname, 'doneHistory.json');
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

      let dataArray = [];

      if (fileExists) {
          const fileData = await fs.readFile(filePath, 'utf8');
          dataArray = JSON.parse(fileData);
      }
      dataArray.push(updatedData[0])
      await fs.writeFile('doneHistory.json', JSON.stringify(dataArray, null, 2));
  
      await fs.writeFile('done.json', JSON.stringify(originalData, null, 2));
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/getManagerData', async (req, res) => {
  const filePath = path.join(__dirname, 'doneHistory.json');
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    const dataArray = JSON.parse(fileData);
    res.send(dataArray);
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).send('Internal Server Error');
  }
});

let currentIndex = 0;
let innerIndex = 0;

async function getWallet(init) {
  const filePath = path.join(__dirname, 'users.json');
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    
    const dataArray = JSON.parse(fileData);

    const walletsArray = dataArray.filter(user => user.role === 'agent').map(agent => agent.wallets);
    wallets = walletsArray

    if(wallets.length !== 0 ){
      if(init === 'init'){
        return walletsArray[0][0].number
      }else{
        if(currentIndex > walletsArray.length - 1){
          innerIndex = 0;
          currentIndex = 0;
        }else{
  
          if(innerIndex+1 > walletsArray[currentIndex].length - 1){
            if(currentIndex + 1 > walletsArray.length -1 ){
              currentIndex = 0;
              innerIndex = 0;
              return walletsArray[0][0].number
            }else{
              currentIndex++;
              innerIndex = 0;
              return walletsArray[currentIndex][innerIndex].number;  
            }
          }else{
            innerIndex++;
            return walletsArray[currentIndex][innerIndex].number;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading data file:', error);
  }
}

let currentWallet = undefined;
let walletName = undefined;

async function initWallet (){
   currentWallet = await getWallet('init');
}

initWallet()

setInterval(async () => {
  try {
    currentWallet = await getWallet();
  } catch (error) {
    console.error('Error:', error);
  }
}, 5 * 60 * 1000);

app.get('/getCurrentWallet', (req, res) => {
  res.send({currentWallet})
});

app.post('/updateSolde', async (req, res) => {
  const { username, solde } = req.body;
  const filePath = path.join(__dirname, 'users.json');

  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    const dataArray = JSON.parse(fileData);
    const userIndex = dataArray.findIndex(user => user.username === username);

    if (userIndex !== -1) {
      dataArray[userIndex].solde = solde;
      await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2), 'utf8');

      res.send(dataArray[userIndex]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating solde:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/getUser', async (req, res) => {
  const { username } = req.body;
  const filePath = path.join(__dirname, 'users.json');

  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    const dataArray = JSON.parse(fileData);
    const user = dataArray.find(user => user.username === username);

    if (user) {
      res.send({ solde: user.solde, wallets: user.wallets });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getAgents', async (req, res) => {
  const filePath = path.join(__dirname, 'users.json');
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    const dataArray = JSON.parse(fileData);
    
    const agents = dataArray.filter(user => user.role === 'agent');
    
    res.send(agents); 
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/addAgent', async (req, res) => {
  const data = req.body;

  try {
      const filePath = path.join(__dirname, 'users.json');

      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

      let dataArray = [];

      if (fileExists) {
          const fileData = await fs.readFile(filePath, 'utf8');
          dataArray = JSON.parse(fileData);
      }

      dataArray.push(data);

      await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2), 'utf8');

      res.send('Data appended successfully.');
  } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/editAgent', async (req, res) => {
  const { agent } = req.body;
  const filePath = path.join(__dirname, 'users.json');

  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    const dataArray = JSON.parse(fileData);
    const userIndex = dataArray.findIndex(user => user.username === agent.username);

    if (userIndex !== -1) {
      dataArray[userIndex] = agent;
      await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2), 'utf8');

      res.send(dataArray[userIndex]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating solde:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/declineOrder', async (req, res) => {
  try {
    const item = req.body
    item[0].increment = item[0].increment +1; 

    const originalData = JSON.parse(await fs.readFile('data.json', 'utf8'));
    const users = JSON.parse(await fs.readFile('users.json', 'utf8'));
    const wallets = [] 
    for (i in users){
      if(users[i].role === 'agent'){
        wallets.push(users[i].wallets)
      }
    }
    if(item[0].increment > wallets.length-1){
      const updatedIndices = item.map((updatedItem) =>
        originalData.findIndex((originalItem) => originalItem.id === updatedItem.id)
      );

      updatedIndices.forEach((index) => originalData.splice(index, 1));
      await fs.writeFile('data.json', JSON.stringify(originalData, null, 2));
    }else{
      let walletIndex = undefined;
      let walletInnerIndex = undefined

      for (w in wallets){
        for(i in wallets[w]){
          if(wallets[w][i].number === item[0].wallet){
            walletIndex = parseInt(w)
            walletInnerIndex = i
          }
        }
      }

      if(walletIndex+1 > wallets.length-1){
        item[0].wallet = wallets[0].find(wallet => wallet.name = item[0].name).number
        item[0].mode_paiement = wallets[0].find(wallet => wallet.name = item[0].name).name
      }else{
        item[0].wallet = wallets[walletIndex+1][walletInnerIndex].number
        item[0].mode_paiement = wallets[walletIndex+1][walletInnerIndex].name
      }
      const updatedIndices = item.map((updatedItem) =>
        originalData.findIndex((originalItem) => originalItem.id === updatedItem.id)
      );     
      updatedIndices.forEach((index) => {
        originalData[index].increment = item[0].increment
        originalData[index].wallet = item[0].wallet
      });

      await fs.writeFile('data.json', JSON.stringify(originalData, null, 2));
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/removeAgent', async (req, res) => {
  const agent = req.body
  const filePath = path.join(__dirname, 'users.json');

  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    const dataArray = JSON.parse(fileData);
    const userIndex = dataArray.findIndex(user => user.username === agent.username);

    if (userIndex !== -1) {
      dataArray.splice(userIndex, 1);
      await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2), 'utf8');

      res.send(dataArray);
    } else {
      res.status(404).send('User not found');
    }

  } catch (error) {
    console.error('Error updating solde:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/loginDashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/Dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/modePaiement', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/Paiement', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
