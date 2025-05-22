import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../../models/user.model';
import { ApiService } from '../../../service/api.service';

@Injectable({ providedIn: 'root' })
export class UserStore {
    private readonly usersSignal = signal<User[]>([]);
    private readonly selectedUserSignal = signal<User | null>(null);

    readonly users = computed(() => this.usersSignal());
    readonly selectedUser = computed(() => this.selectedUserSignal());

    constructor(private api: ApiService) { }

    // Load all users
    loadUsers() {
        this.api.getUsers().subscribe((users) => this.usersSignal.set(users));
    }

    // Load a single user
    loadUser(id: number) {
        this.api.getUser(id).subscribe(user => this.selectedUserSignal.set(user));
    }

    // Create user
    createUser(user: User) {
        this.api.createUser(user).subscribe(newUser => {
            this.usersSignal.update(users => [...users, newUser]);
        });
    }

    // Update user
    updateUser(id: number, updatedUser: User) {
        this.api.updateUser(id, updatedUser).subscribe(user => {
            this.usersSignal.update(users =>
                users.map(u => (u.id === id ? user : u))
            );
        });
    }

    // Delete user
    deleteUser(id: number) {
        this.api.deleteUser(id).subscribe(() => {
            this.usersSignal.update(users => users.filter(u => u.id !== id));
        });
    }

    // Reset selected user
    clearSelectedUser() {
        this.selectedUserSignal.set(null);
    }
}
