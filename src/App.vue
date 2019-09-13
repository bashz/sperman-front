<template>
  <div id="game">
    <div v-if="user">
      <stages v-if="mode === 'solo'" />
      <rooms v-if="mode === 'multi'" />
      <setting v-if="mode === 'setting'" />
      <div id="menu" v-if="mode === 'menu'">
        <img src="/splash.png" class="logo" />
        <div class="button-group">
          <button @click="toggle('solo')">Solo</button>
          <button @click="toggle('multi')">Multi</button>
          <button @click="toggle('setting')">Settings</button>
        </div>
      </div>
    </div>
    <div v-if="!user">
      <img src="/splash.png" />
      <h1>{{message}}</h1>
    </div>
  </div>
</template>

<script>
import Stages from "./components/Stages";
import Rooms from "./components/Rooms";
import Setting from "./components/Setting";
export default {
  name: "App",
  components: {
    Stages,
    Rooms,
    Setting
  },
  data() {
    return {
      mode: "menu",
      user: null,
      message: "Loading, please wait"
    };
  },
  mounted() {
    FB.getLoginStatus(response => {
      if (response.status === "connected") {
        FB.api("/me", data => {
          fetch(`${process.env.VUE_APP_API_URL}/login`, {
            mode: "cors",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
              fbId: response.authResponse.userID,
              signedRequest: response.authResponse.signedRequest,
              expiresIn: response.authResponse.expiresIn,
              name: data.name
            })
          })
            .then(response => {
              return response.json();
            })
            .then(user => {
              this.user = user;
            })
            .catch(err => {
              this.message =
                "Error while connecting to the game, please reload!";
            });
        });
      } else if (response.status === "not_authorized") {
        this.message = "You need to authenticate to the app to proceed";
      } else {
        this.message = "Please connect to your Facebook account to proceed";
      }
    });
  },
  methods: {
    toggle(mode) {
      this.mode = mode;
    }
  }
};
</script>

<style>
#game {
  height: 600px;
  width: 800px;
}
#menu {
  height: 600px;
  width: 800px;
  background-color: #000000;
  text-align: center;
}
html {
  font-family: kontrapunkt;
}
h1 {
  color: #ffffff;
  margin: -20% 20%;
  text-align: center;
}
.logo {
  width: 300px;
  height: 200px;
}
.button-group {
  margin: 0 auto;
  width: 200px;
}
button {
  margin: 0 0 32px 0;
  color: #000000;
  text-transform: uppercase;
  background: #ffffff;
  padding: 20px;
  border: 4px solid#000000;
  border-radius: 6px;
  transition: all 0.5s ease 0s;
  cursor: pointer;
  font-family: kontrapunkt;
  width: 200px;
  display: block;
}
button:hover {
  color: #000000;
  text-shadow: 0px 2px 5px #000000;
  border-radius: 50px;
  border-color: #494949;
  transition: all 0.3s ease 0s;
}
</style>
