import { useEffect, useContext } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import { Context } from './index';
import { observer } from 'mobx-react-lite';

function App() {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return <LoginForm />;
  }

  return (
    <div className="App">
      <h1>
        {store.isAuth
          ? `User ${store.user.email} is authorized.`
          : 'Please login.'}
      </h1>
      <h1>
        {!store.user.isActivated
          ? `Please activate account.`
          : 'Your account has been activated.'}
      </h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={() => store.getUsers()}>Get Users</button>
      </div>
      <div>
        {store.users.map((user) => {
          return <div key={user.email}>{user.email}</div>;
        })}
      </div>
    </div>
  );
}

export default observer(App);
