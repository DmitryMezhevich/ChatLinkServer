// SELECT

    // 
    getUserWithEmail:           SELECT * FROM "users" WHERE user_email = $1;

    // 
    getUserWithUserName:        SELECT * FROM "users" WHERE user_name = $1;

    // 
    getDevice:                  SELECT user_devices.*
                                FROM "user_devices" 
                                JOIN "users" ON user_devices.user_id = users.user_id 
                                WHERE users.user_id = $1 AND user_devices.device_ip = $2;

    //
    getRefreshToken:            SELECT device_refresh_tokens.refresh_token
                                FROM "device_refresh_tokens"
                                WHERE device_id = $2;

    //
    getVerificationCode:        SELECT device_ferification_code.verification_code, device_ferification_code.created_at
                                FROM "device_ferification_code"
                                WHERE device_id = $1;

// INSERT

    //
    createUser:                 INSERT INTO "users" (user_email)
                                VALUES ($1);

    //
    createDevice:               INSERT INTO "user_devices" (user_id, device_name, device_ip)
                                VALUES ($1, $2, $3);

    //
    addVerificationCode:        INSERT INTO "device_ferification_code" (device_id, verification_code)
                                VALUES ($1, $2);
                            
    //
    addRefreshToken:            INSERT INTO "device_refresh_tokens" (device_id, refresh_token)
                                VALUES ($1, $2);

// UPDATE

    //
    apdateVerificationCode:     UPDATE "device_ferification_code" 
                                SET verification_code = $1,
                                    created_at = DEFAULT
                                WHERE device_id = $2;

    //
    apdateRefreshToken:         UPDATE "device_refresh_tokens" 
                                SET refresh_token = $1
                                WHERE device_id = $2;

    //
    activateDevice:             UPDATE "user_devices" 
                                SET device_is_activate = $1
                                WHERE device_id = $2;

    //
    addInfoFromUser:            UPDATE "users"
                                SET user_name = $1,
                                    user_password_hash = $2,
                                    user_avatar_url = $3,
                                    account_is_activate = $4
                                WHERE user_id = $5;


