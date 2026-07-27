    // تحميل المهام من LocalStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let mood = "create";
    let editId = null; // بدل tmp، دلوقتي بنخزن الـ id مش الـ index

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

    // Insert / Update Task
    function addTask() {
    let title = document.getElementById("taskTitle").value;
    let priority = document.getElementById("priority").value;

    if (title.trim() === "") {
        alert("اكتب اسم المهمة");
        return;
    }

    if (mood === "create") {
        let newTask = {
        id: Date.now(),
        title: title,
        priority: priority,
        status: "todo",
        };
        tasks.push(newTask);
    } else {
        // نلاقي المهمة الأصلية بالـ id مش بالـ index
        let task = tasks.find((t) => t.id === editId);
        if (task) {
        task.title = title;
        task.priority = priority;
        // status بيفضل زي ما هو من غير ما نلمسه
        }

        mood = "create";
        editId = null;

        document.getElementById("insertBtn").style.display = "inline-block";
        document.getElementById("updateBtn").style.display = "none";
        document.getElementById("cancelBtn").style.display = "none";
    }

    saveTasks();
    renderTasks();

    document.getElementById("taskTitle").value = "";
    document.getElementById("priority").value = "Medium";
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

    sortByPriority();

    tasks.forEach((task) => {
        let card = document.createElement("div");
        card.className = "task";
        card.draggable = true;
        card.dataset.id = task.id; // نحط الـ id على الكارد نفسه

        let strong = document.createElement("strong");
        strong.textContent = task.title; // textContent يحمي من XSS

        let p = document.createElement("p");
        p.textContent = "Priority: " + task.priority;

        let updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.onclick = () => updateTask(task.id);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(task.id);

        card.appendChild(strong);
        card.appendChild(p);
        card.appendChild(updateBtn);
        card.appendChild(deleteBtn);

        card.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("taskId", task.id);
        });

        document.getElementById(task.status).appendChild(card);
    });
    }

    // دخول وضع التعديل
    function updateTask(id) {
    let task = tasks.find((t) => t.id === id);
    if (!task) return;

    document.getElementById("taskTitle").value = task.title;
    document.getElementById("priority").value = task.priority;

    mood = "update";
    editId = id;

    document.getElementById("insertBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
    document.getElementById("cancelBtn").style.display = "inline-block";

    window.scroll({
        top: 0,
        behavior: "smooth",
    });
    }

    // إلغاء وضع التعديل
    function cancelEdit() {
    mood = "create";
    editId = null;

    document.getElementById("taskTitle").value = "";
    document.getElementById("priority").value = "Medium";

    document.getElementById("insertBtn").style.display = "inline-block";
    document.getElementById("updateBtn").style.display = "none";
    document.getElementById("cancelBtn").style.display = "none";
    }

    // حذف
    function deleteTask(id) {
    let confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        renderTasks();

        // لو كنت بتعدل المهمة اللي اتمسحت، ارجع لوضع الإضافة
        if (mood === "update" && editId === id) {
        cancelEdit();
        }
    }
    }

    // Drag & Drop
    function allowDrop(event) {
    event.preventDefault();
    }

    function drop(event) {
    event.preventDefault();

    let id = Number(event.dataTransfer.getData("taskId"));
    let dropTarget = event.currentTarget; // العمود نفسه، مش أي عنصر جوه

    let task = tasks.find((t) => t.id === id);
    if (task) {
        task.status = dropTarget.id;
        saveTasks();
        renderTasks();
    }
    }

    // البحث
    document.getElementById("tasksearch").addEventListener("input", function () {
    let value = this.value.toLowerCase();

    document.querySelectorAll(".task").forEach((card) => {
        if (card.innerText.toLowerCase().includes(value)) {
        card.style.display = "block";
        } else {
        card.style.display = "none";
        }
    });
    });
