<script lang="ts">
    import CryptoJS from "crypto-js";
    let username = $state('');
    let password = $state('');

    async function sendData() {
        const aesPassPhrase = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex)

        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify({
                username: username,
                password: password
            }), 
            aesPassPhrase
        ).toString();

        await fetch("/api", {
            method: 'PUT', 
            body: JSON.stringify({
                body: encrypted,
                key: aesPassPhrase
            }), 
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
</script>

<div class="flex flex-col gap-4 p-8">
    <p>Username</p>
    <input 
        type="text" 
        placeholder="Username" 
        autocomplete="off" 
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        bind:value={username}
    />

    <p>Password</p>
        <input 
        type="text" 
        placeholder="Password" 
        autocomplete="off" 
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        bind:value={password}
    />

    <button type="button" class="rounded-lg bg-blue-500 p-4 text-white" onclick={() => sendData()}>
        Log In
    </button>
</div>