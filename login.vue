<template>
    
      <fieldset style="width: 30%; margin-left:auto; margin-right:auto; margin-top:50px;">
        <legend style="text-align: center;">Login</legend>
        <div v-if="warning" class="alert alert-warning alert-dismissible fade show" role="alert">
           {{message}}
          <button type="button" class="btn-close" data-bs-dismiss="alert" v-on:click="close()"></button>
        </div>
        <div class="form-floating mb-3">
        <input type="email" class="form-control" v-model="input.email" id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
        <input type="password" class="form-control" v-model="input.password" id="floatingPassword" placeholder="Password" v-on:keyup.enter="login()">
        <label for="floatingPassword">Password</label>
        </div>
        <br>
        <button style="width: 100%;" type="submit" v-on:click="login()" class="btn btn-primary"> Log in </button>
      </fieldset>
      
</template>  


<script type="module">
import axios from 'axios';



export default {
        name: 'login',
        data() {
            
            return{
                input:{
                  email: "",
                  password: ""
                },
                res:[],
                currentUser:{},
                warning:false,
                message:"",
  
            }
        },
        methods :{
         login: async function()  {
            
            if(this.input.email != "" && this.input.password != ""){
              try {
                await
                axios.post('http://127.0.0.1:3000/login', this.input)
                   .then (response => (this.res = response))
                    this.$cookies.set('token', this.res.data.token, '1d');
                    sessionStorage.setItem('currentUserId',this.res.data.id);
                    sessionStorage.setItem('currentUserName',this.res.data.name);
                    //console.log(document.cookie);
                    console.log(sessionStorage.getItem('currentUserId'));
                    console.log(sessionStorage.getItem('currentUserName'));
                    this.$router.replace({ name: "home" });
              }     
              catch(err){
                  console.log(err);
                  if (err.response.status==404){
                    this.message="The email and / or password is incorrect";
                    this.warning=true;
                  }
                  else{
                    this.message= err.message ;
                    this.warning=true;
                  }
              }
            }
            else{
              this.message="An email and password must be present";
              this.warning=true;
              console.log("An email and password must be present");
            }
              this.input.password='';
        },
        close: function(){
          this.warning=false;
        }
        }
}
       
</script>