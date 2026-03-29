<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<header class="flex mx-auto items-center justify-center rounded-b prose prose-green">
    <div class="flex-1"></div>
    <a class="flex-1 text-center justify-center" href="/">wretched.computer</a>
    <div class="flex-1 text-end ml-auto">
        <a href="https://github.com/wgreenberg">github</a>
        <a href="https://bsky.app/profile/wretched.computer">bluesky</a>
    </div>
</header>
{@render children()}
