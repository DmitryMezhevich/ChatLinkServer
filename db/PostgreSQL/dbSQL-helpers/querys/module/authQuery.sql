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
    getVerifyDataByEmail:       SELECT * FROM user_email_activate WHERE user_id = $1
                                LIMIT 1;

    //
    getData2FA:                 SELECT user_devices.*, users.*
                                FROM user_devices
                                JOIN user_devices ON user_devices.user_id = users.user_id 
                                JOIN user_devices ON user_devices.device_id = device_2FA.device_id 
                                WHERE user_devices.device_id = $1;

// INSERT

    //
    insertNewEmail:             INSERT INTO users (user_email)
                                VALUES ($1) RETURNING user_id;

    //
    insertVerifyCodeByEmail:    INSERT INTO user_email_activate (user_id, verification_code)
                                VALUES ($1, $2);

    //
    createDevice:               INSERT INTO user_devices (device_id, user_id, device_name, device_name_app, device_ip)
                                VALUES ($1, $2, $3, $4, $5) RETURNING *;
                            
    //
    insertRefreshToken:         INSERT INTO device_refresh_tokens (device_id, refresh_token)
                                VALUES ($1, $2);

    //
    insertNew2FA:               INSERT INTO device_2FA (device_id, verification_code)
                                VALUES ($1, $2);

// UPDATE

    //
    apdateVerificationCodeByEmail:      UPDATE user_email_activate 
                                        SET verification_code = $2,
                                            created_at = DEFAULT
                                        WHERE user_id = $1;

    //
    activateEmail:              UPDATE users
                                SET user_email_isActivate = true
                                WHERE user_id = $1 RETURNING *;
    
    //
    createNewUser:              UPDATE users 
                                SET user_name = $1, 
                                    user_password_hash = $2, 
                                    user_avatar_url = $3
                                WHERE user_id = $4;

    //
    update2FA:                  UPDATE device_2FA 
                                SET verification_code = $2,
                                    created_at = DEFAULT
                                WHERE device_id = $1;

// DELETE

    //
    deleteRefreshToken:         DELETE FROM device_refresh_tokens WHERE device_id = $1;

    //
    deleteDevice:               DELETE FROM user_devices WHERE device_id = $1 RETURNING *;

    //
    deleteVerifyCodeByEmail:    DELETE FROM user_email_activate WHERE user_id = $1;

// TRANSACTION

    begin:                      BEGIN;

    commit:                     COMMIT;

    rollback:                   ROLLBACK;


