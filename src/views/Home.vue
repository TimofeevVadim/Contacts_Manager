<template>
  <div class="home">
    <div class="head d_flex">
      <h1 class="head__h1">Contacts manager</h1>
      <div class="icons d_flex">
        <svg @click="update" class="iconSvg" id="updateContacts" width="16" height="16" viewBox="0 0 16 16"
             fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M13.645 2.35C12.195 0.9 10.205 0 7.995 0C3.575 0 0.00500488 3.58 0.00500488 8C0.00500488 12.42 3.575 16 7.995 16C11.725 16 14.835 13.45 15.725 10H13.645C12.825 12.33 10.605 14 7.995 14C4.685 14 1.995 11.31 1.995 8C1.995 4.69 4.685 2 7.995 2C9.655 2 11.135 2.69 12.215 3.78L8.995 7H15.995V0L13.645 2.35Z"
              fill="black" fill-opacity="0.54"/>
        </svg>
        <svg @click="output" class="iconSvg" width="18" height="18" viewBox="0 0 18 18" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M2 0H16C17.1 0 18 0.9 18 2V16C18 17.1 17.1 18 16 18H2C0.89 18 0 17.1 0 16V12H2V16H16V2H2V6H0V2C0 0.9 0.89 0 2 0ZM8.5 14L7.09 12.59L9.67 10H0V8H9.67L7.09 5.41L8.5 4L13.5 9L8.5 14Z"
                fill="black" fill-opacity="0.54"/>
        </svg>
      </div>
    </div>
    <div class="frame d_flex">
      <div class="category frame-border">
        <div class="category__row" v-for="storage in contactStorages" :key="storage.id"
             @click="getUsers(storage.Id)">
          <h2 class="category__row-h2">{{ storage.Id }}</h2>
        </div>
      </div>
      <div class="contacts frame-border d_flex d-f_column">
        <div class="contact" v-for="user in users" :key="user.id" @click="getContactInfo(user)">
          <h2 class="contact__userName">{{ user.FullName ? user.FullName : 'No name' }}</h2>
          <p class="contact__mail">{{ user.ViewEmail ? user.ViewEmail : 'No email address' }}</p>
        </div>
      </div>
      <div class="contact-info frame-border">
        <div class="contact-info__row d_flex">
          <h2 class="row__title">Name</h2>
          <p class="row__value">{{ currentUser.FullName ? currentUser.FullName : 'No name' }}</p>

        </div>
        <div class="contact-info__row d_flex">
          <h2 class="row__title">Email</h2>
          <p class="row__value">{{ currentUser.ViewEmail ? currentUser.ViewEmail : 'No email address'}}</p>

        </div>
        <div class="contact-info__row d_flex">
          <h2 class="row__title">Phone</h2>
          <p class="row__value"></p>

        </div>
        <div class="contact-info__row d_flex">
          <h2 class="row__title">Address</h2>
          <p class="row__value"></p>

        </div>
        <div class="contact-info__row d_flex">
          <h2 class="row__title">Skype</h2>
          <p class="row__value"></p>

        </div>
        <div class="contact-info__row d_flex">
          <h2 class="row__title">Facebook</h2>
          <p class="row__value"></p>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Home',
  data: () => ({
    contactStorages: [],
    uuids: {},
    users: {},
    currentStorage: '',
    currentUser: {},
    host: ''
  }),
  components: {},
  mounted() {
    this.host = localStorage.getItem('host')
    if (localStorage.getItem('contactStorages')) {
      this.contactStorages = JSON.parse(localStorage.getItem('contactStorages'))
      this.getContacts()
    } else {
      this.getContacts()
    }
  },
  methods: {
    update() {
      const token = localStorage.getItem('token')
      this.host = localStorage.getItem('host')
     /*
     Вариант для полной синхронизации, происходит всё то же, что и при первом входе

      localStorage.clear()
      localStorage.setItem('token', token)
      localStorage.setItem('host', this.host)
      this.contactStorages = []
      this.users = {}
      this.getContacts()*/


      /*
      Второй вариант:
      * Если CTag изменяется при любом изменении списка контактов, то нахожу изменённые стораджи,
      * нахожу измененные контакты и перезаписываю их
      */
      let storages = localStorage.getItem('contactStorages')
      let bodyFormData = new FormData();
      bodyFormData.append('Module', 'Contacts');
      bodyFormData.append('Method', 'GetContactStorages');
      axios({
        url: this.host,
        method: 'POST',
        async: true,
        dataType: 'json',
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + token
        }
      })
      .then( res => {
        if (storages !== JSON.stringify(res.data.Result)) {
          localStorage.setItem('contactStorages', JSON.stringify(res.data.Result))
          storages = JSON.parse(storages)
          const requestStorages = []
          for (let i = 0; i < res.data.Result.length; i++) {
            let storageLocal = JSON.stringify(storages[i])
            let storageResult = JSON.stringify(res.data.Result[i])
            if (storageLocal !== storageResult) {
                requestStorages.push(res.data.Result[i]['Id'])
            }
          }
           for (let i = 0; i < requestStorages.length; i++) {
             this.getContactsInfo(requestStorages[i])
           }
        }
      })
    },
    getContacts() {
      let bodyFormData = new FormData();
      bodyFormData.append('Module', 'Contacts');
      bodyFormData.append('Method', 'GetContactStorages');
      const token = localStorage.getItem('token')
      axios({
        url: this.host,
        method: 'POST',
        async: true,
        dataType: 'json',
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + token
        }
      })
          .then(res => {
                if (JSON.stringify(this.contactStorages) !== JSON.stringify(res.data.Result)) {

                  this.contactStorages = res.data.Result
                  const contactStorages = JSON.stringify(res.data.Result)
                  localStorage.setItem('contactStorages', contactStorages)
                  let uuids = {}
                  if (!localStorage.getItem('uuids')) {
                    for (let i = 0; i < this.contactStorages.length; i++) {
                      uuids[this.contactStorages[i].Id] = {}
                    }
                    localStorage.setItem('uuids', JSON.stringify(uuids))
                  } else {
                    uuids = JSON.parse(localStorage.getItem('uuids'))
                  }
                  const uuidsKeys = Object.keys(uuids)

                  for (let i = 0; i < uuidsKeys.length; i++) {
                    this.getContactsInfo(uuidsKeys[i])
                  }
                }
              }
          )
    },
    getUsers(storage) {
      const storageArr = localStorage.getItem(`${storage}Arr`)
      this.users = JSON.parse(storageArr)
    },
     getContactsInfo(storage) {
      const storageArr = localStorage.getItem(`${storage}Arr`)
      if (storageArr !== 'undefined' && storageArr !== null) {
        this.users = JSON.parse(storageArr)
      } else {
        localStorage.removeItem(storage)
        this.users = []
      }
      this.currentStorage = storage
      let bodyFormData = new FormData();
      bodyFormData.append('Module', 'Contacts');
      bodyFormData.append('Method', 'GetContactsInfo');
      bodyFormData.append(
          'Parameters', `{"Storage":"${storage}"}`
      )
      const token = localStorage.getItem('token')
      axios({
        url: this.host,
        method: 'POST',
        async: true,
        dataType: 'json',
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + token
        }
      })
          .then(res => {
                const requestUuids = []
                const contactsInfo = res.data.Result.Info
                const uuids = JSON.parse(localStorage.getItem('uuids'))
                if (localStorage.getItem(storage) !== String(res.data.Result.CTag) || !storageArr) {
                  let uuid = ''
                  for (let i = 0; i < contactsInfo.length; i++) {
                    uuid = contactsInfo[i].UUID
                    requestUuids.push(`"${uuid}"`)
                    uuids[storage][uuid] = contactsInfo[i].ETag
                  }
                  localStorage.setItem(storage, res.data.Result.CTag)
                } else {
                  localStorage.setItem(storage, res.data.Result.CTag)
                  let uuid = ''
                  for (let i = 0; i < contactsInfo.length; i++) {
                    uuid = contactsInfo[i].UUID
                    if (uuids[storage][uuid] !== contactsInfo[i].ETag) {
                      requestUuids.push(`"${uuid}"`)
                      uuids[storage][uuid] = contactsInfo[i].ETag
                    }
                  }
                }
                localStorage.setItem('uuids', JSON.stringify(uuids))
            console.log(requestUuids)
                if (requestUuids.length > 0) {
                  this.GetContactsByUids(token, requestUuids, storage)
                }
              }
          )
    },
    GetContactsByUids(token, uuids, currentStorage) {
      console.log(uuids, 'uuids')
      let bodyFormData = new FormData();
      bodyFormData.append('Module', 'Contacts');
      bodyFormData.append('Method', 'GetContactsByUids');
      bodyFormData.append(
          'Parameters', `{"Storage":"${currentStorage}","Uids":[${uuids}]}`
      )

      axios({
        url: this.host,
        method: 'POST',
        async: true,
        dataType: 'json',
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + token
        }
      })
          .then(res => {
            let usersLocalStorage = localStorage.getItem(`${currentStorage}Arr`)

            if (usersLocalStorage !== null) {
              usersLocalStorage = JSON.parse(usersLocalStorage)
            }
            let usersRes = res.data.Result
            if (usersLocalStorage !== null) {
              for (let i = 0; i < usersLocalStorage.length; i++) {
                for (let j = 0; j < usersRes.length; j++) {
                  if (usersLocalStorage[i]['UUID'] === usersRes[j]['UUID']) {
                    usersLocalStorage[i] = usersRes[j]
                    usersRes.splice(j, 1)
                    break
                  }
                }
              }
              this.users = usersLocalStorage.concat(usersRes)
            } else  {
              this.users = res.data.Result
            }
            localStorage.setItem(`${currentStorage}Arr`, JSON.stringify(this.users))
          })
    },
    getContactInfo(user) {
      this.currentUser = user
    },
    output() {
      localStorage.clear()
      this.$router.push('/')
    }
  }
}
</script>
<style>
.head {
  position: sticky;
  top: 0px;
  z-index: 2;
  background: #FFFFFF;
  height: 7vh;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.14),
  0px 2px 2px rgba(0, 0, 0, 0.12),
  0px 1px 3px rgba(0, 0, 0, 0.2);
}

.head__h1 {
  padding-left: 16px;
}

.icons {
  align-items: center;
}

.icons svg {
  margin-right: 23px;
}

.iconSvg:hover {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.frame-border {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.14),
  0px 2px 2px rgba(0, 0, 0, 0.12),
  0px 1px 3px rgba(0, 0, 0, 0.2);
}

.category {
  position: sticky;
  top: 7vh;
  height: 93vh;
}

.category__row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.category__row:hover {
  background: #F4F4F4;
  cursor: pointer;
}

.category__row-h2 {
  padding: 12px 0 12px 16px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.87);
  mix-blend-mode: normal;
}

.category {
  width: 26%;
}

.contact {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.contacts {
  width: 37%;
}

.contact:hover {
  background: #F4F4F4;
  cursor: pointer;
}

.contact__userName {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.87);
  mix-blend-mode: normal;
  margin: 12px 0 3px 16px;
}

.contact__mail {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: rgba(0, 0, 0, 0.6);
  mix-blend-mode: normal;
  margin: 0 0 7px 16px;
}

.frame-border {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.14),
  0px 2px 2px rgba(0, 0, 0, 0.12),
  0px 1px 3px rgba(0, 0, 0, 0.2);
}

.contact-info {
  position: sticky;
  top: 7vh;
  height: 93vh;
}

.row__title {
  margin: 15px 0 8px 16px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.87);
  mix-blend-mode: normal;
  width: 35%;
}

.row__value {
  margin: 15px 0 8px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #000000;
}

.contact-info {
  width: 37%;
}

</style>
