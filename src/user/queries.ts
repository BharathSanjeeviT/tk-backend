export const createUser : string = `INSERT INTO users (name,email,phone_no,clg_name) VALUES ($1,$2,$3,$4)`
export const getUserDetails : string = `SELECT * FROM users WHERE email=$1`
export const deleteFromCart : string = `
DELETE FROM users_events
WHERE user_id = $1
AND event_id NOT IN (SELECT unnest($2::int[])) AND users_events.paid = false;
`
export const deleteAllFromCart : string = 'DELETE FROM users_events WHERE user_id = $1 AND users_events.paid = false'
export const insertMissingOnes : string = `
INSERT INTO users_events (user_id, event_id)
    SELECT $1::int, unnest($2::int[])
    ON CONFLICT (event_id, user_id) DO NOTHING
`
export const getCart : string = `select e.name, e.event_id, e.fee, e.date from events e
join users_events ue
on ue.event_id = e.event_id
where ue.user_id = $1 AND ue.paid = false`
export const begin : string = 'BEGIN'
export const commit : string = 'COMMIT'
export const rollback : string = 'ROLLBACK'
