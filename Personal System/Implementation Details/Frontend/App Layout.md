When you look at the App file, there is this AppLayout element that kind of wraps the whole thing, and I thought these two were somehow connected, but they are actually independent. 

1. What does it do ?
This component gives you everything that is not the main component. 
For example, you can choose to look at your profile, posts, search reels, but the navigation bar is always on the bottom. You could've had a navigation bar as a component, that wraps things, but this App Layout will hold the navigation bar, headers, footers for you. Everything other than the main page being displayed will be defined in the App Layout. and it is defined as a reusable UI.

2. How does it do this ? 
`import { Link, Outlet, useLocation } from "react-router-dom";`
We can see that Outlet and useLocation is included where we don't know what it is. 
	1. `Outlet` is where it holds the parent. In the App file the AppLayout kind of has a children of four routes, and Outlet will get whatever is in it, this actually kind of acts like a function parameter, where something is passed to AppLayout so it can be reused. 
	```App.ts
	<Route element={<AppLayout />}>
		<Route index element={<Navigate to="/login" replace />} />
		<Route path="/login" element={<LoginPage />} />
		<Route path="/expenses" element={<ExpensesPage />} />
		<Route path="*" element={<NotFoundPage />} />
	</Route>
	   ```
Lets go though the render process to have a better understanding
	a.  User clicks a Link in the layout -> the URL is changed to the corresponding URL without reloading the page. 
	b. When rendering the App component, Routes define what component matches with the URL, and React router gives the component that is matched with the URL.
	c. React Router inserts that component into the `<Outlet/>`

3. Difference between Link and Route 
You wouldn't understand before knowing the difference between these 2. 
	- `<Link>` creates a clickable element that _changes_ the URL without refreshing the page.
		It doesn't know anything about the URL, just a component that goes to the url.
	- `<Route>` maps the url to a component, and it doesn't have to be in the same file as the link.
	- `<Routes>` There are multiple `<Route>` components rapped in `<Routes>`. The Routes works by rendering the first component whose _path_ matches the URL in the browser's address bar.
	- `<BrowseRouter>` is used in the main file wrapping the app. Normally the browser loads a new page when the URL in the address bar changes. However, with the help of the [HTML5 history API](https://css-tricks.com/using-the-html5-history-api/), _BrowserRouter_ enables us to use the URL in the address bar of the browser for internal "routing" in a React application. So, even if the URL in the address bar changes, the content of the page is only manipulated using Javascript, and the browser will not load new content from the server. Using the back and forward actions, as well as making bookmarks, is still logical like on a traditional web page.

4. Why do we need to wrap the Routes with a Route whose element is the layout. 
	Well so that the parents can pass things into the the Outlet of the children dynamically I think.
## Notes
Let's talk about some things about React Router. 
Let's think about how we would render different components on our page. We have already done something similar in Open Full Stack. Using a state and the react trick to render different components, but it will end up with a long logic if there are multiple components to render.
```
const [page, setPage] = useState("login");

return (
  <>
    {page === "login" && <LoginPage />}
    {page === "expenses" && <ExpensesPage />}
  </>
);
```
This is dynamic rendering, but you are not able to refresh, use back/ forward, and the link cannot be shared because the same link is multiple pages.  This all known internally by React. You have to understand that Browsers can also control the state by using the "URLs" !

So based on that I can have code where a component is responsible for changing the URL. The app will detect the change and render based on the url. Yes this is how React Route is implemented but it comes with a lot of other features. 
### History
#### Beginning
In the very beginning (1993 - 2004) URL = Page Load, and URLs result in a GET HTTP request which returns a html file what can be rendered by the browser. 

#### AJAX (2004 -2007)
People started making web pages that **update parts of the UI without refreshing** 
so they were able to make a lot of changes without having the browser rerender and reload, by replacing stuff with the content fetched from the server.
But still:
- URL didn’t change
- Back/forward buttons broke
- Bookmarking didn’t work
Developers realized:
👉 “We want dynamic content BUT we still want URLs to mean something.”
This is when the idea of **client-side routing** emerged.

#### The Hash (`#`) Hack (2007–2012)
Frameworks like **Backbone.js**, **jQuery Router**, **Sammy.js** used:
`http://example.com/#/login` 
Because everything after `#` is NOT sent to the server.  
JavaScript can read it and change the UI.
This allowed:
- dynamic rendering
- without reloading
- without breaking the browser
- with working back button
For the first time, developers said:
👉 “Changing the URL can control what part of the single page we render."
This era gave birth to the Single-Page Application (SPA).

#### HTML5 History API (2011–today)
Then browsers added: `history.pushState()` `history.replaceState()`
These allow:
- changing the URL **without reload**
- triggering browser history
- making URLs look normal (`/login`, not `#/login`)

This is when **true client-side routing** became standard.
Frameworks jumped on it:
- AngularJS (2010–2015)
- Ember.js (2011)
- React Router (2014)
- Vue Router (2015)

Suddenly developers could write:
`history.pushState({}, "", "/login");`
And JavaScript apps could say:
👉 “When URL = /login, render LoginPage.”
This made SPAs behave like normal websites.

The concept of SPA is to have an entire website by loading just one HTML page. 
Basically, the HTML 5 history and # hack led allowed the browser to not reload after getting a new url. 

**Old Web (pre-2011):**
- Changing URL = tells server to load a new page
**Modern SPA Web:**
- Changing URL = tells JavaScript to render a different component (no server involved)