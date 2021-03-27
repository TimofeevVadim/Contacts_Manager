<template>
 <div id="app">
   <router-view/>
 </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
* {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
a {
  text-decoration: none;
}
h1, h2, h3, h4, h5, h6{
  margin: 0;
}
*,
*:before,
*:after
{
  box-sizing: border-box;
}

.d_flex {
  display: flex;
}
.d-f_column {
  flex-direction: column;
}
</style>
