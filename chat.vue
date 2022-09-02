<template>
    <div>
        <!-- Nav bar -->
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand">User management</a>
                 <div >{{this.currentUserName}}</div>
                <button v-on:click="logout()" type="button" class="btn btn-dark"> Log out </button>
            </div>
        </nav>
        <b-card-group style="margin-top:50px; margin-left:100px; margin-right:100px">
             <b-card style=" display: inline-block; " no-body header=""  v-if="chatOn">
                <div style="overflow-y: auto; height:450px;">
                <div style=" background: #F0EDED; height: 35px; text-align:center;" >{{this.userName}}</div>
                <b-list-group  flush v-for="message in messages" :key="message.id"  >
                    <b-list-group-item id="listgroup-ex"> {{message.message}}</b-list-group-item>
                </b-list-group>
                <div style="position:absolute;bottom:5px; margin-left:5px;">
                        <div style="display: inline-block;">
                            <b-form-input  class="mb-2 mr-sm-2 mb-sm-0" placeholder="Type message" type="text" v-model="msg" v-on:keyup.enter="sendMessage()" ></b-form-input>
                        </div>
                        <div style="display: inline-block;">
                            <b-button variant="primary" v-on:click="sendMessage()">Send</b-button>
                        </div>
                </div>
                </div>
            </b-card>
            <b-card header="Users list" style="display: inline-block;">
                <div style="overflow-y: auto; height:450px;">
                <b-list-group  v-for="user in users" :key="user.id">
                    <b-list-group-item  v-on:click="openChat(user)" button >
                          <b-avatar class="mr-3"></b-avatar>{{user.name}}
                          
                    </b-list-group-item>
                    <br>
                </b-list-group>
                </div>
            </b-card>
        </b-card-group>
    </div>
</template>
<script>

import axios from 'axios';

import io from 'socket.io-client';


export default {
    name: 'Chat',
    
    data() {
        return {
            users: [],
            chatOn: false,
            userId:null,
            userName:'',
            msg: '',
            currentUserId:null,
            currentUserName: sessionStorage.getItem('currentUserName'),
            messages: [],
            socket : io('http://localhost:5000'),
            res:[],
            new_message:[],
            chatId:null,
            chat_list:[],
            unRead: false,
           
        }
    },
        
    methods:{
        openChat: async function(user){
            this.chatOn=true;
            console.log('Choosen user: '+user.id);
            this.userId=user.id;
            this.userName=user.name;
            this.currentUserId=sessionStorage.getItem('currentUserId');
            console.log('Current user id: '+ this.currentUserId);
            this.messages=[]

            await
            axios
                .post('http://127.0.0.1:3000/chat/'+this.userId+'/'+this.currentUserId)
                .then (response => (this.res = response))
                this.chatId=this.res.data;
                sessionStorage.setItem('currentChatId',this.res.data);
                console.log('Choosen chat id: '+this.res.data); 
                
           axios
                .get('http://127.0.0.1:3000/listMessages/'+this.chatId)
                .then(response => (this.messages = response.data))

                
                if(!this.chat_list.includes(this.chatId)){
                    this.socket.emit('chatId',[this.chatId, this.currentUserName]);
                    
                    this.chat_list.push(this.chatId);    
                }
        },

        sendMessage: async function(){
                
                axios
                .post('http://127.0.0.1:3000/sendMessage/'+this.chatId+'/'+sessionStorage.getItem('currentUserId'), {message: sessionStorage.getItem('currentUserName')+': '+ this.msg} )
                
                console.log('sending....')
                this.socket.emit(sessionStorage.getItem('currentChatId'), this.msg);
                //this.messages.push({message: this.msg});
                this.msg='';
                this.unRead=true;
        },
        logout: function() {
                sessionStorage.removeItem('currentUserName');
                sessionStorage.removeItem('currentUserId');
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                this.$router.replace({ name: "login" });
            },
    },
    async mounted () {

                var chat_id = sessionStorage.getItem('currentChatId');
        axios
        .get('http://127.0.0.1:3000/utilisateurs',{headers:{Authorization: `Bearer ${document.cookie}`}})
        .then(response => (this.users = response.data))

        this.socket.on(chat_id, (msg)=>{
            this.messages.push({message: msg});
            this.unRead=false;
            console.log(msg);
        })


  }
}
</script>
