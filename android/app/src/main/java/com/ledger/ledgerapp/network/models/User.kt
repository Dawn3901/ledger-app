package com.ledger.ledgerapp.network.models

import com.google.gson.annotations.SerializedName

data class User(
    val id: Int,
    val username: String,
    @SerializedName("avatar_path")
    val avatarPath: String?
)

data class UserUpdate(
    @SerializedName("avatar_path")
    val avatarPath: String?
)
