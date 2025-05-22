import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  signal,
  computed
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { User } from '../../models/user.model';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { UserStore } from './state/user.store';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgForOf],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('usersModal') usersModal!: ElementRef;

  userForm!: FormGroup;
  editingUserId: number | null = null;

  searchTerm = signal('');
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.userStore.users().filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  constructor(private fb: FormBuilder, private userStore: UserStore) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required]
    });

    this.userStore.loadUsers();
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const userData: User = this.userForm.value;

    if (this.editingUserId) {
      this.userStore.updateUser(this.editingUserId, userData);
    } else {
      this.userStore.createUser(userData);
    }

    this.resetForm();

    const modalEl = document.getElementById('usersModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  }

  editUser(user: User) {
    this.editingUserId = user.id!;
    this.userForm.patchValue(user);

    const modalEl = document.getElementById('usersModal');
    if (modalEl) {
      const modalInstance = new bootstrap.Modal(modalEl);
      modalInstance.show();
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteUser(id: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userStore.deleteUser(id);
    }
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }


  resetForm() {
    this.editingUserId = null;
    this.userForm.reset({ role: 'User' });
  }
}
