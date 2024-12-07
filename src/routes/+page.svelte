<script lang="ts">
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';

    // Define a type for the task
    interface Task {
        task: string;
        reason: string;
        dueDate: string; // ISO string format
        petName?: string; // Optional pet name
    }

    // Create writable stores for task inputs and task list
    let taskInput = writable(''); // Store for task input
    let reasonInput = writable(''); // Store for reason input
    let dueDateInput = writable(''); // Store for due date input
    let tasks = writable<Task[]>([]); // Store for tasks
    let lastAddedTask = writable<Task | null>(null); // Store for the last added task
    let pets = writable<{ name: string }[]>([]); // Store for pets (only name is needed)
    let newPetName = writable(''); // Store for new pet name

    // Function to add a new task
    async function addTask() {
        const newTask: Task = {
            task: $taskInput,
            reason: $reasonInput,
            dueDate: new Date($dueDateInput).toISOString(), // Convert to ISO string
            petName: selectedPetName,
        };

        // Send a POST request to add the new task
        await fetch("/api/tasks", {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Clear the input fields after adding the task
        taskInput.set('');
        reasonInput.set('');
        dueDateInput.set('');
        selectedPetName = '';

        // Update the last added task store
        lastAddedTask.set(newTask);

        // Fetch the updated list of tasks
        fetchTasks();
    }

    // Function to fetch tasks from the server
    async function fetchTasks() {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        console.log(data); // Log the data to check its structure
        tasks.set(data); // Update the tasks store with the fetched data
    }

    // Function to add a new pet
    function addPet() {
        if ($newPetName) {
            pets.update(currentPets => [...currentPets, { name: $newPetName }]);
            newPetName.set('');
        }
    }

    // Fetch tasks when the component mounts
    onMount(() => {
        fetchTasks();
    });

    // Store for selected pet name
    let selectedPetName = '';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
    <div class="flex flex-row gap-8 w-full max-w-6xl">
        <div class="flex flex-col gap-8 w-full max-w-md">
            <div class="bg-white shadow-md rounded-lg p-6">
                <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Add a New Task</h2>
                
                <div class="flex flex-col gap-4">
                    <label class="text-gray-600" for="task">Task</label>
                    <input 
                        id="task"
                        type="text" 
                        placeholder="Enter the task" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200 ease-in-out" 
                        bind:value={$taskInput}
                    />

                    <label class="text-gray-600" for="reason">Reason</label>
                    <input 
                        id="reason"
                        type="text" 
                        placeholder="Enter the reason" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200 ease-in-out" 
                        bind:value={$reasonInput}
                    />

                    <label class="text-gray-600" for="dueDate">Due Date</label>
                    <input 
                        id="dueDate"
                        type="datetime-local" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200 ease-in-out" 
                        bind:value={$dueDateInput}
                        />

                    <label class="text-gray-600" for="petName">Pet Name</label>
                    <select 
                        id="petName" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200 ease-in-out" 
                        bind:value={selectedPetName}
                    >
                        <option value="" disabled selected>Select your pet name</option>
                        {#each $pets as pet}
                            <option value={pet.name}>{pet.name}</option>
                        {/each}
                    </select>

                    <button 
                        type="button" 
                        class="rounded-lg bg-blue-500 p-4 text-white font-semibold hover:bg-blue-600 transition duration-200 ease-in-out" 
                        on:click={addTask}
                    >
                        Add Task
                    </button>
                </div>
            </div>

            <div class="bg-white shadow-md rounded-lg p-6">
                <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Add a New Pet</h2>
                
                <div class="flex flex-col gap-4">
                    <label class="text-gray-600" for="newPetName">Pet Name</label>
                    <input 
                        id="newPetName"
                        type="text" 
                        placeholder="Enter your pet's name" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200 ease-in-out" 
                        bind:value={$newPetName}
                    />

                    <button 
                        type="button" 
                        class="rounded-lg bg-green-500 p-4 text-white font-semibold hover:bg-green-600 transition duration-200 ease-in-out" 
                        on:click={addPet}
                    >
                        Add Pet
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
            <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Task List</h2>
            <ul class="flex flex-col gap-2">
                {#each $tasks as currentTask}
                    <li class="bg-gray-50 border border-gray-300 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-800">{currentTask.task || 'No Task'}</h3>
                        <p class="text-gray-600">Reason: {currentTask.reason || 'No Reason'}</p>
                        <p class="text-gray-600">Due Date: {currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleString() : 'No Due Date'}</p>
                        <p class="text-gray-600">Pet Name: {currentTask.petName || 'No Pet'}</p>
                    </li>
                {/each}
            </ul>
        </div>
    </div>

    {#if $lastAddedTask}
        <div class="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg mt-4 w-full max-w-md">
            <h3 class="font-semibold">Last Added Task:</h3>
            <p>Task: {$lastAddedTask.task}</p>
            <p>Reason: {$lastAddedTask.reason}</p>
            <p>Due Date: {new Date($lastAddedTask.dueDate).toLocaleString()}</p>
            <p>Pet Name: {$lastAddedTask.petName || 'No Pet'}</p>
        </div>
    {/if}
</div>