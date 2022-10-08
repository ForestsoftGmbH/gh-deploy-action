module.exports = async ({github, context, core, version, changelog}) => {
    try {
        // delete all draft releases and create a new one
        const releases = await github.rest.repos.listReleases({ owner: context.repo.owner, repo: context.repo.repo });

        for (const release of releases.data) {
            if (release.draft) {
                await github.rest.repos.deleteRelease({ owner: context.repo.owner, repo: context.repo.repo, release_id: release.id });
            }
        }
        await github.rest.repos.createRelease({
            draft: true,
            generate_release_notes: true,
            name: "Release " + version,
            owner: context.repo.owner,
            prerelease: true,
            repo: context.repo.repo,
            body: changelog,
            tag_name: version,
        });

    } catch (error) {
        if (error.message != "Not Found") {
            core.setFailed(error.message);
        } else {

        }
    }
};