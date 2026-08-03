# Testimonials Production Verification

Use this to prove that production testimonials are persisted in PostgreSQL and survive redeploys.

## Quick command

Run from project root:

	./scripts/testimonials-prod-verify.ps1 -BaseUrl "https://YOUR_DOMAIN" -AdminUsername "YOUR_ADMIN_USERNAME" -AdminPassword "YOUR_ADMIN_PASSWORD"

The script prints JSON with pass/fail checks and exits with status 0 on success, 1 on failure.

## What it validates

1. Public testimonials API responds and returns stats shape.
2. Admin login works.
3. Admin dashboard stats endpoint works.
4. New public testimonial submission is accepted.
5. Submission appears in admin pending queue.
6. Approve action succeeds.
7. Approved testimonial becomes publicly visible.
8. Approved review increments total stats.

## Persistence proof after redeploy

1. Run the script once and note createdTestimonialId from output.
2. Redeploy on Vercel.
3. Run the script again with NoMutation to avoid creating another record:

	./scripts/testimonials-prod-verify.ps1 -BaseUrl "https://YOUR_DOMAIN" -AdminUsername "YOUR_ADMIN_USERNAME" -AdminPassword "YOUR_ADMIN_PASSWORD" -NoMutation

4. Open admin list (status=all) and confirm the prior ID still exists.

## Optional cleanup

If you want the script to delete the verification testimonial at the end:

	./scripts/testimonials-prod-verify.ps1 -BaseUrl "https://YOUR_DOMAIN" -AdminUsername "YOUR_ADMIN_USERNAME" -AdminPassword "YOUR_ADMIN_PASSWORD" -Cleanup

## Notes

- If admin endpoints return 401/403, update your allowed admin IP list for the network where this script runs.
- If submit or admin mutations return 503, production DATABASE_URL is not available at runtime in your deployment.
- The script does not change any UI or design.
