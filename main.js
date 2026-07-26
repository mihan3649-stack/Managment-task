    // تحميل المهام من LocalStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // ترتيب الأولوية
    function sortByPriority() {
    let priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
    };

    tasks.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    }

    // تشغيل أول عرض
    renderTasks();

    // إضافة مهمة
    function addTask() {
    let title = document.getElementById("taskTitle").value;

    let priority = document.getElementById("priority").value;

    if (title.trim() === "") {
        alert("اكتب اسم المهمة");

        return;
    }

    let task = {
        id: Date.now(),

        title: title,

        priority: priority,

        status: "todo",
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    document.getElementById("taskTitle").value = "";
    }

    // حفظ البيانات
    function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // عرض المهام
    function renderTasks() {
    document.getElementById("todo").innerHTML = "";

    document.getElementById("progress").innerHTML = "";

    document.getElementById("done").innerHTML = "";

    // ترتيب حسب الأولوية
    sortByPriority();

    tasks.forEach((task) => {
        let card = document.createElement("div");

        card.className = "task";

        card.draggable = true;

        card.id = task.id;

        card.innerHTML = `

            <strong>${task.title}</strong>

            <p>
            priority ${task.priority}
            </p>


            <button onclick="deleteTask(${task.id})">
            delete
            </button>

            `;

        // بداية السحب
        card.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("taskId", task.id);
        });

        document.getElementById(task.status).appendChild(card);
    });
    }

    // السماح بالإفلات
    function allowDrop(event) {
    event.preventDefault();
    }

    // نقل المهمة بين الأعمدة
    function drop(event) {
    event.preventDefault();

    let id = event.dataTransfer.getData("taskId");

    let task = tasks.find((t) => t.id == id);

    let newStatus = event.target.id;

    if (newStatus) {
        task.status = newStatus;
    }

    saveTasks();

    renderTasks();
    }

    // حذف مهمة
    function deleteTask(id) {
    tasks = tasks.filter((task) => task.id != id);

    saveTasks();

    renderTasks();
    }

    // البحث
    document.getElementById("tasksearch").addEventListener("input", function () {
    let searchValue = this.value.toLowerCase();

    document.querySelectorAll(".task").forEach((card) => {
        if (card.innerText.toLowerCase().includes(searchValue)) {
        card.style.display = "block";
        } else {
        card.style.display = "none";
        }
    });
    });                               