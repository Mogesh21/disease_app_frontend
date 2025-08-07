const menuItems = {
  items: [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/app/dashboard/reports'
        },
        {
          id: 'users',
          title: 'Admins',
          type: 'collapse',
          icon: 'feather icon-slack',
          children: [
            {
              id: 'users',
              title: 'Users',
              type: 'item',
              icon: 'feather icon-users',
              url: '/app/dashboard/admin/users'
            },
            {
              id: 'add-user',
              title: 'Add user',
              type: 'item',
              icon: 'feather icon-user-plus',
              url: '/app/dashboard/admin/add-user'
            }
          ]
        },
        {
          id: 'categories',
          title: 'Categories',
          type: 'collapse',
          icon: 'feather icon-mic',
          children: [
            {
              id: 'categories-list',
              title: 'Categories List',
              type: 'item',
              icon: 'feather icon-users',
              url: '/app/dashboard/categories/categories-list'
            },
            {
              id: 'add-category',
              title: 'Add Category',
              type: 'item',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/categories/add-category'
            }
          ]
        },
        {
          id: 'diseases',
          title: 'Diseases',
          type: 'collapse',
          icon: 'feather icon-zap',
          url: '/app/dashboard/diseases/diseases-list',
          children: [
            {
              id: 'diseases-list',
              title: 'Diseases List',
              type: 'item',
              icon: 'feather icon-pocket',
              url: '/app/dashboard/diseases/diseases-list'
            },
            {
              id: 'add-disease',
              title: 'Add Disease',
              type: 'item',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/diseases/add-disease'
            }
          ]
        },
        {
          id: 'trivias',
          title: 'Trivias',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/app/dashboard/trivia/trivias-list'
        },
        {
          id: 'reports-list',
          title: 'User Reports',
          type: 'item',
          icon: 'feather icon-alert-triangle',
          url: '/app/dashboard/reports/reports-list'
        },
        {
          id: 'profile',
          title: 'Profile',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/dashboard/profile/edit-profile'
        }
      ]
    }
  ]
};

export default menuItems;
