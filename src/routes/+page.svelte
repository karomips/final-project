<script lang="ts">
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { signOut } from '@auth/sveltekit/client';

    interface Task {
        task: string;
        reason: string;
        dueDate: string;
        petName?: string;
    }

    let taskInput = writable('');
    let reasonInput = writable('');
    let dueDateInput = writable('');
    let tasks = writable<Task[]>([]);
    let lastAddedTask = writable<Task | null>(null);
    let pets = writable<{ name: string }[]>([]);
    let newPetName = writable('');
    let selectedPetName = '';
    let showTaskModal = writable(false);
    let showPetModal = writable(false);

    async function addTask() {
        const newTask: Task = {
            task: $taskInput,
            reason: $reasonInput,
            dueDate: new Date($dueDateInput).toISOString(),
            petName: selectedPetName,
        };

        await fetch("/api/tasks", {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: { 'Content-Type': 'application/json' },
        });

        taskInput.set('');
        reasonInput.set('');
        dueDateInput.set('');
        selectedPetName = '';
        lastAddedTask.set(newTask);
        fetchTasks();
        showTaskModal.set(false);
    }

    async function fetchTasks() {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        tasks.set(data);
    }

    function addPet() {
        if ($newPetName) {
            pets.update(currentPets => [...currentPets, { name: $newPetName }]);
            newPetName.set('');
            showPetModal.set(false);
        }
    }

    onMount(() => {
        fetchTasks();
    });

    async function handleSignOut() {
        await signOut();
        goto('/auth/signin');
    }
</script>

<style>
:global(body) {
    background: linear-gradient(135deg, #111333, #13293d, #194e3c);
    background-size: 400% 400%;
    animation: gradientBackground 10s ease infinite;
    font-family: 'Roboto', sans-serif;
    margin: 0;
    color: #f5f5f5;
    transition: background-color 0.3s ease;
}

@keyframes gradientBackground {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    transition: padding 0.3s ease;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .7rem 2rem;
    background-color: #1d5552;
    color: #e0e0e0;
    border-bottom: 2px solid #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
}

.navbar h1 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #ffffff;
}

.card {
    background-color: #1d5552;
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    margin-top: 2rem;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    outline: 2px solid #ffffff;
    outline-offset: 2px;
}

.card:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transform: translateY(-4px);
    outline: 2px solid #ffffff;
    outline-offset: 2px;
}

.card h2 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
    color: #fff;
}

.task-list {
    background-color: #ffffff;                                                   
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    transition: gap 0.3s ease;
}

.task-item {
    background-color: #1d5552;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    color: #ffffff;
    margin-bottom: 1rem;
}

.task-details p {
    color: #ffffff; /* Make sure text in task details is white */
}

.task-item:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.task-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #ffffff;
}

.due-date-container {
    font-size: 0.9rem;
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    display: inline-block;
    transition: background-color 0.3s ease;
}

.due-date-upcoming {
    background-color: #50e3c2;
}

.due-date-overdue {
    background-color: #e53e3e;
}

.task-details {
    margin-bottom: 10px;
    font-size: 1rem;
}

.label {
    font-weight: 600;
    color: #ffffff;
}

.btn {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.btn:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transform: translateY(-4px);
    outline: 2px solid #ffffff;
    outline-offset: 2px;
}

.btn-primary {
    background-color: #ffffff;
    color: rgb(0, 0, 0);
}

.btn-primary:hover {
    background-color: #3b8a3b;
    transform: scale(1.05);
}

.btn-secondary {
    background-color: #ffffff;
    color: black;
}

.btn-secondary:hover {
    background-color: #e59742;
    transform: scale(1.05);
}

.btn:hover {
    opacity: 0.85;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: #3c4348;
    color: #f5f5f5;
    border-radius: 15px;
    padding: 2rem;
    width: 80%;
    max-width: 400px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease-in-out;
}

.modal h2 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.75rem;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #4e9e4e;
    border-radius: 8px;
    background: #2f3438;
    color: #fff;
    font-size: 1rem;
}

.modal-close {
    background: #e53e3e;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.modal-close:hover {
    background: #d9534f;
}
</style>

<nav class="navbar">
    <h1>Pet Scheduling System</h1>
    <button on:click={handleSignOut} class="btn btn-secondary">Sign Out</button>
</nav>

<div class="container">
    <button on:click={() => showTaskModal.set(true)} class="btn btn-primary">
        Add Task
    </button>
    <button on:click={() => showPetModal.set(true)} class="btn btn-secondary">
        Add Pet
    </button>

    {#if $showTaskModal}
        <div class="modal-overlay">
            <div class="modal">
                <button class="modal-close" on:click={() => showTaskModal.set(false)}>Close</button>
                <h2>Add a New Task</h2>
                <div class="form-group">
                    <label for="task">Task</label>
                    <input id="task" type="text" bind:value={$taskInput} placeholder="Task name" />
                </div>
                <div class="form-group">
                    <label for="reason">Reason</label>
                    <input id="reason" type="text" bind:value={$reasonInput} placeholder="Task reason" />
                </div>
                <div class="form-group">
                    <label for="dueDate">Due Date</label>
                    <input id="dueDate" type="datetime-local" bind:value={$dueDateInput} />
                </div>
                <div class="form-group">
                    <label for="petName">Pet Name</label>
                    <select id="petName" bind:value={selectedPetName}>
                        <option value="" disabled>Select a pet</option>
                        {#each $pets as pet}
                            <option value={pet.name}>{pet.name}</option>
                        {/each}
                    </select>
                </div>
                <button on:click={addTask} class="btn btn-primary">Add Task</button>
            </div>
        </div>
    {/if}

    {#if $showPetModal}
        <div class="modal-overlay">
            <div class="modal">
                <button class="modal-close" on:click={() => showPetModal.set(false)}>Close</button>
                <h2>Add a New Pet</h2>
                <div class="form-group">
                    <label for="newPetName">Pet Name</label>
                    <input id="newPetName" type="text" bind:value={$newPetName} placeholder="Pet's name" />
                </div>
                <button on:click={addPet} class="btn btn-primary">Add Pet</button>
            </div>
        </div>
    {/if}

    <div class="card"> 
        <h2>Your Task List</h2> 
        <div class="task-list">
            {#each $tasks as currentTask} 
                <li class="task-item"> 
                    <div class="task-header"> 
                        <strong class="task-title">{currentTask.task || 'No Task'}</strong> 
                        <div class={`due-date-container ${new Date(currentTask.dueDate) > new Date() ? 'due-date-upcoming' : 'due-date-overdue'}`}>
                            Due: {currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleString() : 'No Due Date'}
                        </div>
                    </div> 
                    <div class="task-details">
                        <p><span class="label">Reason:</span> {currentTask.reason}</p>
                        {#if currentTask.petName}
                            <p><span class="label">Pet Name:</span> {currentTask.petName}</p>
                        {/if}
                    </div> 
                </li> 
            {/each}
        </div> 
    </div>
</div>
