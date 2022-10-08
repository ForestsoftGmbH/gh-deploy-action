module.exports = async ({ github, context }) => {
    try {
        const { repo, owner } = context.repo;
        console.log(github.event)
        const result = await github.rest.pulls.create({
            title: `${github.event.head_commit.message}`,
            owner,
            repo,
            head: github.ref_name,
            base: 'main',
            body: [
                'This PR is auto-generated by',
                '[actions/github-script](https://github.com/actions/github-script).'
            ].join('\n')
        });
        let labels = [];
        let branch = github.ref_name;
        switch (true) {
            case branch.startsWith('feature/'):
            case branch.startsWith('feat/'):
                labels.push('enhancement');
                break;
            case branch.startsWith("fix/"):
            case branch.startsWith("bugfix/"):
            case branch.startsWith("hotfix/"):
                labels.push('bug');
                break;
            default:
                console.log('No label found');
                break;
        }
        github.rest.issues.addLabels({
            owner,
            repo,
            issue_number: result.data.number,
            labels: labels
        });
    } catch (error) {
        console.log(github)
        console.log(error);
    }
};