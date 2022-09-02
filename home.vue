
<template>
 
    <div>
        <!-- Nav bar -->
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand">User management</a>
    
                <button v-on:click="logout()" type="button" class="btn btn-dark"> Log out </button>
    
            </div>
        </nav>
        <!-- Add user button -->
        <div style="margin-left:85rem; margin-top:60px; margin-buttom:auto">
            <button v-b-modal.modal-1 type="button" class="btn btn-success" v-on:click="modalOn()"> <i class="bi bi-plus-square"> Add user</i></button>
            <br>
            <b-button variant="outline-primary" style="margin-top:8px" v-on:click="usersList()"> <i class="bi bi-chat-dots">  Chat    </i></b-button>
        </div>
        
        <!-- Add user modal -->
        <div>
            <b-modal id="modal-1" title="Add new user" hide-footer v-if="insertMode">
                <div class="my-4">
                    <b-form @submit="onSubmit" @reset="onReset" >
                        <b-form-group
                            id="input-group-1"
                            label="Email address:"
                            label-for="input-1">
                        <b-form-input
                            id="input-1"
                            v-model="form.email"
                            type="email"
                            placeholder="Enter email"
                            required></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-2" label="Name:" label-for="input-2">
                        <b-form-input
                            id="input-2"
                            v-model="form.name"
                            placeholder="Enter name"
                            required></b-form-input>
                        </b-form-group>
                        <b-form-group 
                            id="input-group-3" 
                            label="Password:" 
                            label-for="input-3">
                        <b-form-input
                            id="input-3"
                            v-model="form.password"
                            placeholder="Enter Password"
                            type="password"
                            required></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-4" label="Role:" label-for="input-4">
                        <b-form-input
                            id="input-4"
                            label="Role:"
                            v-model="form.role"
                            placeholder="Enter Role"
                            required></b-form-input>
                        </b-form-group>
                        <br>
                        <b-button type="submit" variant="primary">Submit</b-button>
                        <b-button type="reset" variant="danger">Reset</b-button>
                    </b-form>
                </div>
            </b-modal>       
        </div>    
        <!-- Users table -->
        <table style="width: 65%; margin-left:auto; margin-right:auto; margin-top:50px;"  class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email Adress</th>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <th scope="row">{{user.id}}</th>
                    <td>{{user.name}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.role}}</td>
                    <th><button v-b-modal.modal-3 type="button" class="btn btn-primary" v-on:click="editModal(user)" >Edit<i class="bi bi-pencil-square"></i></button>   <button v-b-modal.modal-2 type="button" class="btn btn-danger" v-on:click="deleteModal(user)">Delete<i class="bi bi-trash3-fill"></i></button></th>
                </tr>
            </tbody>
        </table>
        <!-- delete user modal -->
        <div>
            <b-modal id="modal-2" title="Delete user" hide-footer v-if="deleteMode">
                <p class="my-4">Are you sur you want to delete the user named {{ User.name }}?</p>
                <br>
                <button type="button" class="btn btn-danger" v-on:click="Delete(User)">Yes</button>
            </b-modal>
        </div>
        <!-- Edit user modal -->
        <div>
            <b-modal id="modal-3" title="Edit user" hide-footer v-if="editMode">
                <div class="my-4">
                    <b-form @reset="onReset" >
                        <b-form-group
                            id="input-group-1"
                            label="Email address:"
                            label-for="input-1">
                        <b-form-input
                            id="input-1"
                            v-model="form.email"
                            type="email"
                            placeholder= "Enter email"
                            v-bind:value="User.email"
                            required></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-2" label="Name:" label-for="input-2">
                        <b-form-input
                            id="input-2"
                            v-model="form.name"
                            placeholder="Enter name"
                            required></b-form-input>
                        </b-form-group>
                        <b-form-group 
                            id="input-group-3" 
                            label="Password:" 
                            label-for="input-3">
                        <b-form-input
                            id="input-3"
                            v-model="form.password"
                            placeholder="Enter Password"
                            type="password"
                            required></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-4" label="Role:" label-for="input-4">
                        <b-form-input
                            id="input-4"
                            label="Role:"
                            v-model="form.role"
                            placeholder="Enter Role"
                            required></b-form-input>
                        </b-form-group>
                        <br>
                        <b-button type="submit" variant="primary" v-on:click="onEdit(User)">Submit</b-button>
                        <b-button type="reset" variant="danger">Reset</b-button>
                    </b-form>
                </div>
            </b-modal>       
        </div>    
        
    </div> 
    
</template>

<script>
import axios from 'axios';

export default {
        name: 'Utilisateurs',
        data() {
            return {
                
                users: [],
                insertMode:false,
                deleteMode:false,
                userId: null,
                editMode:false,
                userName:"",
                User:{},
                
                form:{
                    email:"",
                    name:"",
                    password:"",
                    role:""
                }
            }
        },
        methods: {
            onSubmit: function(event) {
                event.preventDefault()
                console.log(JSON.stringify(this.form))
                axios
                   .post('http://127.0.0.1:3000/utilisateurs', this.form,{headers:{Authorization: `Bearer ${document.cookie}`}})
                   .then (response => (this.res = response))
                   .catch(err => (console.log(err),(this.err=err)))
                   console.log("Inserted!");
                   this.insertMode=false;
                   this.$router.go()
                   this.$router.replace({ name: "home" });
             },
             onEdit: async function(User){
                
                this.userId=User.id;
                
                console.log(JSON.stringify(this.form))
                console.log(this.userId);
                await
                axios
                   .put('http://127.0.0.1:3000/utilisateurs/'+this.userId, this.form,{headers:{Authorization: `Bearer ${document.cookie}`}})
                   .then (response => (this.res = response))
                    
                    console.log("Edited!");
                    this.editMode=false;
                    this.$router.go()
                    this.$router.replace({ name: "home" });



             },
            modalOn: function(){ 
                this.insertMode=true;
            },
            deleteModal: function(user){
                this.User=user;
                this.deleteMode=true;
            },
            editModal: function(user){
                this.User=user;
                this.editMode=true;
            },
            onReset: function(event) {
                event.preventDefault()
                this.form.email = ''
                this.form.name = ''
                this.form.role = ''
                this.form.password = ''
            },
            Delete: async function(User){
                this.userId=User.id;
                this.userName=User.name;
                console.log(this.userId);

                await
                axios.delete('http://127.0.0.1:3000/utilisateurs/'+this.userId,{headers:{Authorization: `Bearer ${document.cookie}`}})
                   .catch(err => (console.log(err),(this.err=err)))
                   this.deleteMode=false;
                
                axios
                    .get('http://127.0.0.1:3000/utilisateurs',{headers:{Authorization: `Bearer ${document.cookie}`}})
                    .then(response => (this.users = response.data))
            },
            editModal: function(user){
                this.User=user;
                this.editMode=true;
            },
            usersList: function(){
                this.$router.replace({ name: "chat" });
            },
            logout: function() {
                //this.loggedIn=false;
                sessionStorage.removeItem('currentUserName');
                sessionStorage.removeItem('currentUserId');

                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                this.$router.replace({ name: "login" });
            },
            
        },
        mounted () {
                axios
             .get('http://127.0.0.1:3000/utilisateurs',{headers:{Authorization: `Bearer ${document.cookie}`}})
             .then(response => (this.users = response.data))
  }
}
</script>

