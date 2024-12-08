<script lang="ts">
    import { type Record, isRecord } from "@atproto/api/src/client/types/app/bsky/feed/post";
    import * as AppBskyEmbedImages from '@atproto/api/src/client/types/app/bsky/embed/images'
    import * as AppBskyEmbedVideo from '@atproto/api/src/client/types/app/bsky/embed/video'
    import { onMount } from "svelte";

    const IMAGE_HEIGHT=200;

    interface SubstringMatch {
        start: number;
        end: number;
    }

    interface Post {
        record: Record;
        time: string;
        matches?: SubstringMatch[];
        did: string;
        rkey: string;
    }

    const firehoseUrl = new URL("wss://jetstream1.us-west.bsky.network/subscribe");
    firehoseUrl.searchParams.append('wantedCollections', 'app.bsky.feed.post');
    let websocket: WebSocket | undefined = undefined;
    let showEmbeds = $state(false);
    let keywordsStr = $state('');
    let keywords = $derived(keywordsStr === '' ? [] : keywordsStr.split(' ').filter(word => word.length > 0));
    let blasting = $state(false);

    const posts: Post[] = $state([]);

    function search(post: Post): SubstringMatch[] {
        const matches: SubstringMatch[] = [];
        for (const keyword of keywords) {
            const regexp = new RegExp(keyword, 'dgi');
            let result = null;
            while((result = regexp.exec(post.record.text)) !== null) {
                for (const [start, end] of result.indices!) {
                    matches.push({
                        start,
                        end,
                    })
                }
            }
        }
        if (matches.length === 0) {
            return matches;
        }
        matches.sort((a, b) => a.start < b.start ? -1 : 1);
        const result = [matches[0]];
        for (const match of matches.slice(1)) {
            const currentMatch = result[result.length - 1];
            if (currentMatch.end >= match.start) {
                currentMatch.end = Math.max(currentMatch.end, match.end);
            } else {
                result.push(match);
            }
        }
        return result;
    }

    function handlePost(post: Post) {
        if (keywords.length !== 0) {
            const matches = search(post);
            if (matches.length > 0) {
                post.matches = matches;
                posts.unshift(post);
                posts.splice(1000);
            }
		} else {
    		posts.unshift(post);
            posts.splice(1000);
		}
    }

    function blast() {
        blasting = true;
        websocket = new WebSocket(firehoseUrl);
        websocket!.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.kind !== 'commit') {
                    return;
                }
                if (!msg.commit?.collection || !msg.commit.rkey || !msg.commit.rev) {
							return;
				}
				if (msg.commit.operation === 'create' && !msg.commit.record) {
					return;
				}
				const record = msg.commit.record;
				if (!isRecord(record)) {
				    return;
				}
				const date = new Date(record.createdAt);
				const post = {
				    record,
					time: date.toLocaleTimeString(),
					did: msg.did,
					rkey: msg.commit.rkey,
				}
				handlePost(post);
            } catch (e) {
                console.error(e);
            }
        };
    }

    function getImageUrl(post: Post, image: AppBskyEmbedImages.Image): string {
        return `https://cdn.bsky.app/img/feed_thumbnail/plain/${post.did}/${image.image.ref['$link']}@jpeg`
    }

    function getUrl(post: Post): string {
        return `https://bsky.app/profile/${post.did}/post/${post.rkey}`
    }

    function stop() {
        blasting = false;
        websocket!.onmessage = null;
    }

    interface TextSegment {
        text: string;
        highlighted: boolean;
    }

    function splitText(text: string, matches: SubstringMatch[]): TextSegment[] {
        if (matches.length === 0) {
            return [{
                text,
                highlighted: false,
            }];
        }
        const segments = [{
            text: text.slice(0, matches[0].start),
            highlighted: false,
        }];
        for (let i=0; i<matches.length; i++) {
            const match = matches[i];
            segments.push({
                text: text.slice(match.start, match.end),
                highlighted: true,
            });
            if (i === matches.length - 1) {
                segments.push({
                    text: text.slice(matches[matches.length - 1].end),
                    highlighted: false,
                });
            } else {
                const nextMatch = matches[i+1];
                segments.push({
                    text: text.slice(match.end, nextMatch.start),
                    highlighted: false,
                });
            }
        }
       return segments;
    }

    onMount(() => {
        return stop;
    });
</script>

<main class="flex flex-col items-center">
    <div class="flex flex-col prose prose-green">
        <label>Show Images/Videos: <input type="checkbox" bind:checked={showEmbeds} /></label>
        <label>Keyword(s): <input class="rounded-md pl-1 bg-slate-900" type="text" bind:value={keywordsStr} /></label>
        <button class="bg-slate-700 rounded-md m-2" onclick={blasting ? stop : blast}>{ blasting ? "STOP" : "blast me" }</button>
    </div>
    <div class="flex flex-col prose prose-green">
        {#each posts as post}
            <div class="border-[1px] m-1 p-2">
                <div><a href={getUrl(post)}>{post.time}</a></div>
                <div>
                    {#if post.matches && post.matches.length > 0}
                        {@const segments = splitText(post.record.text, post.matches)}
                        {#each segments as segment}
                            <span class={segment.highlighted ? "bg-yellow-700 rounded-md pl-1 pr-1" : ""}>{segment.text}</span>
                        {/each}
                    {:else}
                        {post.record.text}
                    {/if}
                </div>
                {#if showEmbeds && post.record.embed}
                    {#if AppBskyEmbedImages.isMain(post.record.embed)}
                        {#each post.record.embed.images as image}
                            {@const imgUrl = getImageUrl(post, image)}
                            {@const aspectRatio = image.aspectRatio ? image.aspectRatio.width / image.aspectRatio.height : 1}
                            <a href={imgUrl}><img height={IMAGE_HEIGHT} width={aspectRatio * IMAGE_HEIGHT} src={imgUrl} alt="hi"/></a>
                        {/each}
                    {/if}
                {/if}
            </div>
        {/each}
    </div>
</main>
