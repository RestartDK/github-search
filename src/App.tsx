import { SearchUserContainer } from "./components/search-user-container";

function App() {
	return (
		<main className="min-h-screen flex flex-col items-center py-8 px-4  bg-background">
			<section className="w-full max-w-md flex flex-col items-center justify-start mt-24">
				<h1 className="text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Github search</h1>
				<SearchUserContainer />
			</section>
		</main>
	);
}

export default App;
