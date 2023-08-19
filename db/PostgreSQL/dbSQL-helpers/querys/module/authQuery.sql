// SELECT

    // 
    getUser:                    SELECT * FROM users WHERE user_id = $1 OR user_email = $2 OR user_name = $3
                                LIMIT 1;

    // 
    getUsers:                   SELECT * FROM users WHERE user_id = $1 OR user_email = $2 OR user_name = $3
                                LIMIT 2;

    //
    getUserDevice:              SELECT * FROM user_devices WHERE device_id = $1
                                LIMIT 1;

    // 
    getVerifyDataForEmail:       SELECT * FROM user_email_activate WHERE user_id = $1
                                LIMIT 1;

    //
    getData2FA:                 SELECT * FROM device_2FA WHERE device_id = $1
                                LIMIT 1;
                                
    //
    getUserDataTogether2FA:     SELECT user_devices.*, users.*, device_2FA.*
                                FROM user_devices
                                JOIN users ON user_devices.user_id = users.user_id
                                JOIN device_2FA ON user_devices.device_id = device_2FA.device_id
                                WHERE user_devices.device_id = $1

// INSERT

    //
    insertNewEmail:             INSERT INTO users (user_id, user_email)
                                VALUES ($1, $2) RETURNING *;

    //
    insertVerifyCodeForEmail:    INSERT INTO user_email_activate (user_id, activate_verification_code)
                                VALUES ($1, $2);

    //
    createDevice:               INSERT INTO user_devices (device_id, user_id, device_name, device_name_app, device_ip)
                                VALUES ($1, $2, $3, $4, $5) RETURNING *;
                            
    //
    insertRefreshToken:         INSERT INTO device_refresh_tokens (device_id, refresh_token)
                                VALUES ($1, $2);

    //
    insertNew2FA:               INSERT INTO device_2FA (device_id, two_fa_verification_code)
                                VALUES ($1, $2);

// UPDATE

    //
    apdateVerificationCodeForEmail:      UPDATE user_email_activate 
                                        SET activate_verification_code = $2,
                                            activate_created_at = DEFAULT
                                        WHERE user_id = $1;

    //
    activateEmail:              UPDATE users
                                SET user_email_isActivate = true
                                WHERE user_id = $1;
    
    //
    createNewUser:              UPDATE users 
                                SET user_name = $1, 
                                    user_password_hash = $2, 
                                    user_avatar_url = $3
                                WHERE user_id = $4;

    //
    update2FA:                  UPDATE device_2FA 
                                SET two_fa_verification_code = $2,
                                    two_fa_created_at = DEFAULT
                                WHERE device_id = $1;

// DELETE

    //
    deleteRefreshToken:         DELETE FROM device_refresh_tokens WHERE device_id = $1;

    //
    deleteDevice:               DELETE FROM user_devices WHERE device_id = $1 RETURNING *;

    //
    deleteVerifyCodeForEmail:    DELETE FROM user_email_activate WHERE user_id = $1;

    //
    deleteVerifyCodeFor2FA:      DELETE FROM device_2fa WHERE device_id = $1;

// TRANSACTION

    begin:                      BEGIN;

    commit:                     COMMIT;

    rollback:                   ROLLBACK;


