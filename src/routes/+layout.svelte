<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<header class="flex flex-row max-w-screen-xl mx-auto items-center justify-center rounded-b prose prose-green">
    <nav>
        <a href="/">wretched.computer</a>
    </nav>
</header>
{@render children()}
