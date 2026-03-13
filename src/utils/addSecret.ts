   async function Addsecret(password:string) {
     const SALT = 'your-custom-salt-2026'; 
      const saltedPwd = password + SALT;
       const encoder = new TextEncoder();
        const data = encoder.encode(saltedPwd);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
  }
    async function getres(params:string) {
    const secret = await Addsecret(params);
    return secret;
   }

   export {getres};
