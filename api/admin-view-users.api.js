document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#table tbody');
    const msgBox = document.querySelector('#megBox');
    try {
        const fetchUserForAdmin = await fetch('/api/admin/view/users', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!fetchUserForAdmin.ok) {
            msgBox.innerHTML = 'Error fetching Please Refresh The Page'
            return;
        }

        const result = await fetchUserForAdmin.json();

        if (!result || !result.allUsers) {
            msgBox.innerHTML = 'Error!!'
            console.log(`Error ${result ? result.message : 'Unknown error'}`);
            return;
        }

        tableBody.innerHTML = '';

        const users = Array.isArray(result.allUsers) ? result.allUsers : [];

        if (!users.length) {
            console.log("No users found");
            return;
        }

        // Loop through the users and create rows for the table
        users.forEach((user) => {
            const userRow = `
                <tr>
                    <td>${user.firstName || "N/A"}</td>
                    <td>${user.email || "N/A"}</td>
                    <td>${user.number || "N/A"}</td>
                        <td>            
                    <img src="../bin(1).png" class="icons" style="width:20px; height: 20px; cursor:pointer;" data-id="${user._id}" />
                </td> 
                </tr>
            `;
            tableBody.innerHTML += userRow;  // Append each row to the table body
        });

    } catch (error) {
        msgBox.innerHTML = 'Internal Server Error Please try again'
        console.log(`Error: Fetching users ${error}`);
        return;
    };

    // Delete User
    tableBody.addEventListener('click', async (event) => {
        if (event.target.tagName === 'IMG' && event.target.getAttribute('src') === '../bin(1).png') {
            const id = event.target.dataset.id;
            if (!id) {
                msgBox.innerHTML = 'Id not Recived For Delete User';
                return;
            };

            if (id === '678215f5db04064a0ba61f15') {
                alert("admin is not delete this is a admin..");
                location.reload();
                return;
            }

            if (confirm("Are You sure You want to Delete This User ?")) {
                const fetchApiDelte = await fetch(`/api/admin/delete/user/${id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                });

                if (!fetchApiDelte.ok) {
                    msgBox.innerHTML = "Error Fetching Delete Api Please try again"
                    return;
                };

                location.reload()
            };
        };
    });
});
