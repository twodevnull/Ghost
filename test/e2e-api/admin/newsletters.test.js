const {agentProvider, mockManager, fixtureManager, matchers} = require('../../utils/e2e-framework');
const {anyEtag, anyObjectId, anyUuid, anyISODateTime, anyISODate, anyString, anyArray, anyLocationFor, anyErrorId} = matchers;

const newsletterSnapshot = {
    id: anyObjectId
};

let agent;

describe('Newsletters API', function () {
    before(async function () {
        agent = await agentProvider.getAdminAPIAgent();
        await fixtureManager.init();
        await agent.loginAsOwner();
    });

    beforeEach(function () {
    });

    afterEach(function () {
        mockManager.restore();
    });

    it('Can add a newsletter', async function () {
        const newsletter = {
            name: 'My test newsletter',
            sender_name: 'Test',
            sender_email: 'test@example.com',
            sender_reply_to: 'test@example.com',
            default: false,
            status: 'active',
            recipient_filter: '',
            subscribe_on_signup: true,
            sort_order: 0
        };

        await agent
            .post(`newsletters/`)
            .body({newsletters: [newsletter]})
            .expectStatus(201)
            .matchBodySnapshot({
                newsletters: [newsletterSnapshot]
            })
            .matchHeaderSnapshot({
                etag: anyEtag,
                location: anyString
            });

        await agent.get('newsletters/')
            .expectStatus(200)
            .matchBodySnapshot({
                newsletters: [newsletterSnapshot]
            })
            .matchHeaderSnapshot({
                etag: anyEtag
            });
    });

    it('Can browse newsletters', async function () {
        await agent.get('newsletters/')
            .expectStatus(200)
            .matchBodySnapshot({
                newsletters: [newsletterSnapshot]
            })
            .matchHeaderSnapshot({
                etag: anyEtag
            });
    });

    it('Can edit newsletters', async function () {
        const res = await agent.get('newsletters?limit=1')
            .expectStatus(200)
            .matchBodySnapshot({
                newsletters: [newsletterSnapshot]
            })
            .matchHeaderSnapshot({
                etag: anyEtag
            });

        const id = res.body.newsletters[0].id;

        await agent.put(`newsletters/${id}`)
            .body({
                newsletters: [{
                    name: 'Updated newsletter name'
                }]
            })
            .expectStatus(200)
            .matchBodySnapshot({
                newsletters: [newsletterSnapshot]
            })
            .matchHeaderSnapshot({
                etag: anyEtag
            });
    });
});
