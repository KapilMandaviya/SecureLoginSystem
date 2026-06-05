
$(document).ready(function () {


    showLoader();
    //sessionStorage.removeItem('menuData');
    //localStorage.setItem('menuSync', Date.now()); // triggers event in other tabs
    loadMenu(); // reload in current tab

    hideLoader();


    // Show loader when page is refreshing / navigating
    window.addEventListener("beforeunload", function () {
        showLoader();
    });

    // Hide loader after page fully loads
    window.addEventListener("load", function () {
        hideLoader();
    });

    // Show loader on any form submit
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("form").forEach(form => {
            form.addEventListener("submit", () => showLoader());
        });
    });

});

function showLoader() {
    document.getElementById("pageLoader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("pageLoader").style.display = "none";
}


//function loadMenu() {

//    $.ajax({
//        url: '/Home/RoleMenuPermission',
//        method: 'GET',
//        success: function (data) {
//            console.log(data);
//            var $menu = $('#side-menu');
//            $menu.empty();

//            // Add menu title
//            $menu.append('<li class="menu-title">Menu</li>');

//            data.forEach(function (menuItem) {
//                // Build parent menu URL
//                var menuUrl = (menuItem.controllerName && menuItem.actionName)
//                    ? `/${menuItem.controllerName}/${menuItem.actionName}`
//                    : 'javascript:void(0);';

//                // Parent with children (submenu)
//                if (menuItem.children && menuItem.children.length > 0) {
//                    var submenuHtml = '<ul class="sub-menu" aria-expanded="false">';
//                    menuItem.children.forEach(function (sub) {
//                        var subMenuUrl = (sub.controllerName && sub.actionName)
//                            ? `/${sub.controllerName}/${sub.actionName}`
//                            : 'javascript:void(0);';
//                        submenuHtml += `
//                    <li>
//                        <a href="${subMenuUrl}" class="waves-effect">
//                            <i class="${sub.formIcon || 'fas fa-angle-right'}"></i>
//                            ${sub.formName}
//                        </a>
//                    </li>
//                `;
//                    });
//                    submenuHtml += '</ul>';

//                    $menu.append(`
//                <li>
//                    <a href="javascript:void(0);" class="has-arrow waves-effect">
//                        <i class="${menuItem.formIcon || 'fas fa-bars'}"></i>
//                        <span>${menuItem.formName}</span>
//                    </a>
//                    ${submenuHtml}
//                </li>
//            `);
//                } else {
//                    // Parent without children
//                    $menu.append(`
//                <li>
//                    <a href="${menuUrl}">
//                        <i class="${menuItem.formIcon || 'fas fa-bars'}"></i>
//                        <span>${menuItem.formName}</span>
//                    </a>
//                </li>
//            `);
//                }
//            });

//            // Optionally add other sections (e.g., Apps) if needed
//            // $menu.append('<li class="menu-title">Apps</li>');
//        },
//        error: function () {
//            $('#side-menu').html('<li>Error loading menu.</li>');
//        }


//    });


//}
function loadMenu() {
    $.ajax({
        url: '/Home/RoleMenuPermission',
        method: 'GET',
        success: function (data) {
            
            //sessionStorage.setItem('menuData', JSON.stringify(data));

            buildMenu(data);
            // 🔥 Reinitialize metis menu AFTER building menu
            $('#side-menu').metisMenu();


        }
    });
}

//function buildMenu(data) {
    
//    var $menu = $('#side-menu');
//    $menu.empty();
//    $menu.append('<li class="menu-title">Menu</li>');

//    data.forEach(function (menuItem) {

//        var menuUrl = (menuItem.controllerName && menuItem.actionName)
//            ? `/${menuItem.controllerName}/${menuItem.actionName}`
//            : 'javascript:void(0);';

//        // Parent with children (submenu)
//        //<a href="${subMenuUrl}" class="waves-effect">
//        if (menuItem.children && menuItem.children.length > 0) {
//            var submenuHtml = '<ul class="sub-menu" aria-expanded="false">';
//            menuItem.children.forEach(function (sub) {
//                var subMenuUrl = (sub.controllerName && sub.actionName)
//                    ? `/${sub.controllerName}/${sub.actionName}`
//                    : 'javascript:void(0);';
//                submenuHtml += `
//                            <li>
                                
//                                <a href="${subMenuUrl}">
//                                    <i class="${sub.formIcon || 'fas fa-angle-right'}"></i>
//                                    ${sub.formName}
//                                </a>
//                            </li>
//                        `;
//            });
//            submenuHtml += '</ul>';

//            $menu.append(`
//                        <li>
//                            <a href="javascript:void(0);" class="has-arrow waves-effect">
//                                <i class="${menuItem.formIcon || 'fas fa-bars'}"></i>
//                                <span>${menuItem.formName}</span>
//                            </a>
//                            ${submenuHtml}
//                        </li>
//                    `);
//        } else {
//            // Parent without children
//            $menu.append(`
//                        <li>
//                            <a href="${menuUrl}">
//                                <i class="${menuItem.formIcon || 'fas fa-bars'}"></i>
//                                <span>${menuItem.formName}</span>
//                            </a>
//                        </li>
//                    `);
//        }
//    });

     

//}

function buildMenu(data) {
    var $menu = $('#side-menu');

    // 🔥 Destroy old metis instance (VERY IMPORTANT)
    if ($menu.data('metisMenu')) {
        $menu.metisMenu('dispose');
    }

    $menu.empty();
    $menu.append('<li class="menu-title">Menu</li>');

    data.forEach(function (menuItem) {

        var menuUrl = (menuItem.controllerName && menuItem.actionName)
            ? `/${menuItem.controllerName}/${menuItem.actionName}`
            : '#';

        if (menuItem.children && menuItem.children.length > 0) {

            var submenuHtml = '<ul class="sub-menu" aria-expanded="false">';

            menuItem.children.forEach(function (sub) {
                var subMenuUrl = (sub.controllerName && sub.actionName)
                    ? `/${sub.controllerName}/${sub.actionName}`
                    : '#';

                submenuHtml += `
                    <li>
                        <a href="${subMenuUrl}">
                            <i class="${sub.formIcon || 'fas fa-angle-right'}"></i>
                            ${sub.formName}
                        </a>
                    </li>`;
            });

            submenuHtml += '</ul>';

            $menu.append(`
                <li>
                    <a href="#" class="has-arrow waves-effect">
                        <i class="${menuItem.formIcon || 'fas fa-bars'}"></i>
                        <span>${menuItem.formName}</span>
                    </a>
                    ${submenuHtml}
                </li>
            `);

        } else {
            $menu.append(`
                <li>
                    <a href="${menuUrl}">
                        <i class="${menuItem.formIcon || 'fas fa-bars'}"></i>
                        <span>${menuItem.formName}</span>
                    </a>
                </li>
            `);
        }
    });

    // 🔥 Reinitialize EVERYTHING properly
    setTimeout(function () {
        $('#side-menu').metisMenu();

        // Fix active state again
        initActiveMenu();
    }, 0);
}

function initActiveMenu() {
    $("#sidebar-menu a").each(function () {
        var pageUrl = window.location.href.split(/[?#]/)[0];
        if (this.href == pageUrl) {
            $(this).addClass("active");
            $(this).parent().addClass("mm-active");
            $(this).parent().parent().addClass("mm-show");
            $(this).parent().parent().prev().addClass("mm-active");
        }
    });
}