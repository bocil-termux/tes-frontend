const API_BASE_URL = 'https://backend-five-iota-10.vercel.app/';

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('addTaskForm');
    const tasksContainer = document.getElementById('tasksContainer');
    
    // Muat tugas saat halaman dimuat
    loadTasks();
    
    // Handle form submission
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        
        try {
            await addTask(title, description);
            taskForm.reset();
            loadTasks();
        } catch (error) {
            showError('Gagal menambah tugas: ' + error.message);
        }
    });
    
    // Fungsi untuk memuat tugas
    async function loadTasks() {
        try {
            tasksContainer.innerHTML = '<div class="loading">Memuat tugas...</div>';
            const response = await fetch(`${API_BASE_URL}/api/tasks`);
            
            if (!response.ok) {
                throw new Error('Gagal mengambil data');
            }
            
            const tasks = await response.json();
            displayTasks(tasks);
        } catch (error) {
            showError('Gagal memuat tugas: ' + error.message);
        }
    }
    
    // Fungsi untuk menampilkan tugas
    function displayTasks(tasks) {
        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<div class="loading">Tidak ada tugas.</div>';
            return;
        }
        
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <div class="task-header">
                    <span class="task-title">${task.title}</span>
                    <div class="task-actions">
                        <button class="btn-complete" onclick="toggleTask('${task._id}', ${!task.completed})">
                            ${task.completed ? 'Batal' : 'Selesai'}
                        </button>
                        <button class="btn-delete" onclick="deleteTask('${task._id}')">Hapus</button>
                    </div>
                </div>
                <div class="task-description">${task.description || 'Tidak ada deskripsi'}</div>
                <div class="task-date">Dibuat: ${new Date(task.createdAt).toLocaleString('id-ID')}</div>
            `;
            tasksContainer.appendChild(taskElement);
        });
    }
    
    // Fungsi untuk menambah tugas
    async function addTask(title, description) {
        const response = await fetch(`${API_BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        
        if (!response.ok) {
            throw new Error('Gagal menambah tugas');
        }
        
        return response.json();
    }
    
    // Fungsi untuk menghapus tugas
    window.deleteTask = async function(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Gagal menghapus tugas');
            }
            
            loadTasks();
        } catch (error) {
            showError('Gagal menghapus tugas: ' + error.message);
        }
    };
    
    // Fungsi untuk mengubah status tugas
    window.toggleTask = async function(id, completed) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed })
            });
            
            if (!response.ok) {
                throw new Error('Gagal mengubah status tugas');
            }
            
            loadTasks();
        } catch (error) {
            showError('Gagal mengubah status tugas: ' + error.message);
        }
    };
    
    // Fungsi untuk menampilkan error
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.textContent = message;
        
        // Tambahkan error di atas daftar tugas
        tasksContainer.parentNode.insertBefore(errorElement, tasksContainer);
        
        // Hapus error setelah 5 detik
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
});
