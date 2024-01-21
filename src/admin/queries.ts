export const updatePaid : string = 'UPDATE users_events SET paid = true WHERE user_id = $1'
export const allowIfPaid : string = `
UPDATE users_events
SET is_present = true WHERE user_id = $1 AND event_id = $2 AND paid = true AND is_present = false
RETURNING *`

