<template>
  <v-app>
    <v-navigation-drawer
    app
    light
    height="100%"
    width="300"
    permanent
    >

    <v-list>

      <v-list-tile
      v-if="$session.has('user')"
      >
      <v-list-tile-action>
        <v-icon>account_circle</v-icon>
      </v-list-tile-action>

      <v-list-tile-content>
        <v-list-tile-title>Mon compte</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile
    v-if="$session.has('user') == false"
    @click="dialogConnect = true;"
    >
    <v-list-tile-action>
      <v-icon>person</v-icon>
    </v-list-tile-action>

    <v-list-tile-content>
      <v-list-tile-title>Connexion</v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>

  <v-list-tile
  v-for="item in items"
  :key="item.title"
  v-if="item.bConnected == false || $session.has('user')"
  @click="router.push(item.route)"
  >
  <v-list-tile-action>
    <v-icon>{{ item.icon }}</v-icon>
  </v-list-tile-action>

  <v-list-tile-content>
    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
  </v-list-tile-content>
</v-list-tile>

<v-list-tile
      v-if="$session.has('user')"
      @click="$session.remove('user');$forceUpdate();"
      >
      <v-list-tile-action>
        <v-icon>exit_to_app</v-icon>
      </v-list-tile-action>

      <v-list-tile-content>
        <v-list-tile-title>Déconnexion</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

</v-list>

</v-navigation-drawer>

<v-content transition="slide-x-transition">
  <router-view></router-view>
</v-content>

<v-layout row justify-center>
  <v-dialog
  v-model="dialogConnect" 
  persistent :overlay="false"
  max-width="500px"
  transition="dialog-transition"
  >

  <v-card>
    <v-card-title class="headline">Connexion</v-card-title>
    <v-card-text>

      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6 md4>
            <v-text-field label="Login*" v-model="login" required></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-text-field label="Mot de passe*" v-model="password" required></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" flat @click="dialogConnect = false">Annuler</v-btn>
      <v-btn color="green darken-1" flat @click="onTryToConnect()">Valider</v-btn>
    </v-card-actions>
  </v-card>
  
</v-dialog>
</v-layout>

</v-app>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
        items: [
        {title: "Trottinettes", icon: "map", route: "map", bConnected:false},
        {title: "Historique", icon: "history", route: "historique", bConnected:true},
        {title: "Moyens de payement", icon: "credit_card", route: "payement", bConnected:true},
        {title: "Devenir rechargeur", icon: "power", route: "rechargeur", bConnected:false},
        {title: "Aide", icon: "help", route: "help", bConnected:false}
        ],
        dialogConnect: false,
        login:"",
        password:""
      };
    },
    methods: {
      onShowDialogConnect () {

      },
      onTryToConnect() {
        this.axios
        .post("authentication/login", {
            login: this.login,
            password: this.password
        }).then(response => {
          if (response.status == 200) {
            this.$session.set('user', this.login);
            this.dialogConnect = false;
            console.log(this.$session.get('user'));
          }
        });
      }
    }
  }
</script>

<style>
</style>