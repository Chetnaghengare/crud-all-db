import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.css']
})
export class UserCrudComponent implements OnInit {
  users: any[] = [];
  name = '';
  email = '';
  editMode = false;
  editId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get<any[]>('http://localhost:3000/users')
      .subscribe(data => {
        this.users = data;
      });
  }

  addUser() {
    if (this.name && this.email) {
      this.http.post('http://localhost:3000/users', { name: this.name, email: this.email })
        .subscribe(() => {
          this.name = '';
          this.email = '';
          this.getUsers();
        });
    }
  }

  deleteUser(id: number) {
    this.http.delete(`http://localhost:3000/users/${id}`)
      .subscribe(() => this.getUsers());
  }

  editUser(user: any) {
    this.editMode = true;
    this.name = user.name;
    this.email = user.email;
    this.editId = user.id;
  }

  updateUser() {
    if (this.editId !== null && this.name && this.email) {
      this.http.put(`http://localhost:3000/users/${this.editId}`, { name: this.name, email: this.email })
        .subscribe(() => {
          this.editMode = false;
          this.name = '';
          this.email = '';
          this.editId = null;
          this.getUsers();
        });
    }
  }
}
