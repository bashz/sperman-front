<template>
  <div id="game">
    <div v-if="user">
      <stages v-if="mode === 'solo'" />
      <rooms v-if="mode === 'multi'" />
      <setting v-if="mode === 'setting'" />
      <home v-if="mode === 'menu'" />
    </div>
    <div v-if="!user">
      <img src="https://image.shutterstock.com/image-photo/image-450w-287494247.jpg" />
    </div>
  </div>
</template>

<script>
import Home from "./components/Home";
import Stages from "./components/Stages";
import Rooms from "./components/Rooms";
import Setting from "./components/Setting";
export default {
  name: "App",
  components: {
    Home,
    Stages,
    Rooms,
    Setting
  },
  data() {
    return {
      mode: "solo",
      user: null
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
            .catch(err => console.error(err));
        });
      } else if (response.status === "not_authorized") {
        // the user is logged in to Facebook,
        // but has not authenticated your app
      } else {
        // the user isn't logged in to Facebook.
      }
    });
  }
};
</script>

<style>
#game {
  height: 600px;
}
html {
  font-family: kontrapunkt;
}
</style>
