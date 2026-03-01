#  User Directory App

A simple web app that fetches and shows user data from an API.

##  Features

- Shows list of users with name, email, phone, address
- Search users by name, email, or city
- Filter by company or city
- Sort by name or email
- Dark mode toggle
- Download data as CSV file
- Next/Previous buttons for pagination
- Loading spinner while fetching
- Error message if something fails

##  Built With

- HTML
- CSS
- JavaScript
- Fetch API
- Font Awesome icons

##  How to Run

1. Create a folder on your computer
2. Create these 3 files inside:
   - `index.html`
   - `style.css`
   - `script.js`
3. Copy the code into each file
4. Open `index.html` in any browser

No installation needed!

##  How to Use

| Action | How |
|--------|-----|
| Load users | Auto loads when page opens |
| Search | Type in search box |
| Filter | Select from dropdowns |
| Sort | Choose name or email |
| Refresh | Click "Get Users" |
| Download | Click "Save CSV" |
| Dark mode | Click moon/sun icon |
| Next page | Click "Next" button |
| Previous page | Click "Prev" button |



##  API Used

**URL:** https://jsonplaceholder.typicode.com/users

**What it returns:** Fake user data for testing:
- Name
- Email
- Phone
- Address
- Company
- Website

##  Works On

-  Desktop
-  Tablet
-  Mobile
-  All browsers

##  Functions Explained

- `getUsers()` - Fetches data from API
- `showUsers()` - Displays users on page
- `filterUsers()` - Searches and filters
- `saveToCSV()` - Downloads as CSV
- `toggleDark()` - Switches theme

##  Error Handling

- Shows error if no internet
- Shows error if API fails
- Retry button to try again

##  What I Learned

- How to use Fetch API
- How to handle promises
- How to create HTML with JavaScript
- How to filter and sort arrays
- How to make responsive design
- How to toggle dark mode

##  Future Ideas

- Add more details page
- Add user photos
- Add more APIs
- Add login system

##  Notes

- 6 users shown per page
- Free API may be slow sometimes
- Works offline after loading

