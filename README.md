# WebAppDevCw2-git Coursework Repository

## Login Credentials

username - Password - Role
user - user - user
pantry - pantry - pantry
admin - admin - admin 

## Website Features

1. General Features
* Home Page: Accessible by all users for basic information and navigation.
* About Us Page: Provides background information about the initiative.
* Contact Us Page: A form for users to provide feedback or report issues.
2. Access and Authentication
* Visitor Access: Visitors can view the Home, About, and Contact Us pages, and they have access to the Login and Registration pages.
* User Authentication: Secure login system to verify the identity of Users, Pantries, and Admins.
3. Role-Based Access
* Visitor (Not Logged In): Can access: Home, About, Contact Us, Login, and Registration pages.
* User (Logged In): 
   * Can access: Home, About, Contact Us pages.
   * Features: Add Items, Sign Out.
* Pantry (Logged In):
   * Can access: Home, About, Contact Us pages.
   * Features: View Available Items, Sign Out.
* Admin (Logged In):
   * Can access: Home, About, Contact Us pages.
   * Full control: Add Items, View Available Items, Add Users, Delete Users, Sign Out.
4. Item Management
* Adding Items: Users can list new food items with details such as type, quantity, and expiry date.
* Viewing Available Items: Pantries can browse current listings that are within their expiry and have not been selected by other pantries.
5. Administrative Tools
* User Management: Admins can add and delete user accounts, providing robust control over who can post and access certain information.
* Item Oversight: Admins can manage listings, ensuring that only appropriate and accurate information is posted.
6. Technical Specifications
* Node.js and Express: The application backend is powered by Node.js with Express for handling server-side logic.
* NeDB: Utilizes NeDB for data storage, handling user data and item listings.
* Mustache Templates: Front-end rendering is managed via Mustache templates, ensuring a responsive and dynamic user interface.
7. Additional Features (Optional)
* If an items expiration date is past, then the item is not displayed in the available items list
* Contact us form can be utilised by all roles (including visitors)