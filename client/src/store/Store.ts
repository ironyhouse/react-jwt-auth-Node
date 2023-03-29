import { IUser } from '../models/IUser';
import { makeAutoObservable } from 'mobx';
import AuthService from '../services/AuthService';
import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_ARL } from '../http';
import UserService from '../services/UserService';

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;
  users: IUser[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setUsers(users: IUser[]) {
    this.users = users;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);

      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    }
  }

  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      console.log(response);

      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      // response without access token
      const response = await axios.get<AuthResponse>(`${API_ARL}/refresh`, {
        withCredentials: true,
      });
      console.log(response);

      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }

  async getUsers() {
    try {
      // response without access token
      const response = await UserService.fetchUsers();

      this.setUsers(response.data);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }
}
