import './App.css';
import Form from './Form';

function App() {
  return (
    <div className="App">
      
      <h5 className="App-header">
        Find out if you have a poker hand by inputting your cards. 
        Input cards in the following format: "[value] [suit letter]". 
        For example, you would input a 10 of hearts with "10 H", and a king of spades with "K S". 
      </h5>
      <br/>
      <div className='Input'><Form/></div>
      
    </div>
  );
}

export default App;
