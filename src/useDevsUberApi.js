export default () => ({
    signin:(email, password)=>{
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                let json = {
                    error:'',
                    token:'123'
                }
                resolve(json)
            },1000)
        })
    },
    signup:(name, email, password)=>{
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                let json = {
                    error:''
                }
                if(email == 'erro@hotmail.com'){
                    json.error = 'E-mail e/ou senha inalidos'
                }else{
                    json.token = '123'
                }
                resolve(json)
            },1000)
        })
    },

    getRequestPrice:(distance) => {
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                let json = {
                    error:''
                }
                json.price = distance * 7
                resolve(json)
            },1000)
        })
    }
})