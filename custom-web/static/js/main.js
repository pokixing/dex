const hostname = window.location.hostname;
const protocol = window.location.protocol;

// login();
var dex = new Vue({
    el: "#dex-login",
    delimiters: ["{{{", "}}}"],
    data: {
        loginForm: {
            account: "",
            password: "",
        },
        showRegistration:false,
        showLoginError:false,
        showPassword:false
    },
    methods: {
        async login() {
            const payload = this.loginForm;
            try {
                const userInfoRes = await axios.post("/api/v1/login", payload);
                const userInfo = userInfoRes.data;
                if (userInfo) {
                    store.set("userInfo", userInfo);
                    const roleBindingRes = await axios.get(
                        `/api/v1/userbindings?uid=${userInfo.uid}`,
                        {
                            headers: {
                                Authorization: `Bearer ${userInfo.token}`,
                            },
                        }
                    );
                    const roleBinding = roleBindingRes.data;
                    if (roleBinding) {
                        const role = roleBinding.map((item) => item.role);
                        store.set("role", role);
                        window.location.href = `${protocol}//${hostname}/v1/projects`;
                    }
                }
            } 
            catch (error) {
                this.showLoginError = true;
            }

        },
        async registrationCheck(){
            const registrationRes = await axios.get(`/api/v1/features/RegisterTrigger`);
            if (registrationRes.data && registrationRes.data.enabled) {
                this.showRegistration = true
              } else {
                this.showRegistration = false
              }
        }
    },
    mounted() {
        this.registrationCheck();
    },
});
