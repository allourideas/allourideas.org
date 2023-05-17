# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_05_17_213806) do
  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "alternatives", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "experiment_id"
    t.string "content"
    t.string "lookup", limit: 32
    t.integer "weight", default: 1
    t.integer "participants", default: 0
    t.integer "conversions", default: 0
    t.index ["experiment_id"], name: "index_alternatives_on_experiment_id"
    t.index ["lookup"], name: "index_alternatives_on_lookup"
  end

  create_table "blocked_cookies", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "referrer", default: ""
    t.integer "question_id"
    t.string "user_agent", default: ""
    t.string "ip_addr", default: ""
    t.string "source", default: ""
    t.string "session_id", default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["created_at"], name: "index_blocked_cookies_on_created_at"
    t.index ["ip_addr"], name: "index_blocked_cookies_on_ip_addr"
    t.index ["question_id"], name: "index_blocked_cookies_on_question_id"
  end

  create_table "campaigns", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.json "configuration"
    t.integer "user_id", null: false
    t.integer "post_id"
    t.integer "group_id"
    t.integer "community_id"
    t.integer "domain_id"
    t.string "question_code"
    t.integer "question_id"
    t.boolean "deleted", default: false, null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["id", "community_id", "deleted", "active"], name: "index_campaigns_on_id_and_community_id_and_deleted_and_active"
    t.index ["id", "community_id", "deleted"], name: "index_campaigns_on_id_and_community_id_and_deleted"
    t.index ["id", "domain_id", "deleted", "active"], name: "index_campaigns_on_id_and_domain_id_and_deleted_and_active"
    t.index ["id", "domain_id", "deleted"], name: "index_campaigns_on_id_and_domain_id_and_deleted"
    t.index ["id", "group_id", "deleted", "active"], name: "index_campaigns_on_id_and_group_id_and_deleted_and_active"
    t.index ["id", "group_id", "deleted"], name: "index_campaigns_on_id_and_group_id_and_deleted"
    t.index ["id", "post_id", "deleted", "active"], name: "index_campaigns_on_id_and_post_id_and_deleted_and_active"
    t.index ["id", "post_id", "deleted"], name: "index_campaigns_on_id_and_post_id_and_deleted"
    t.index ["id", "question_code", "deleted"], name: "index_campaigns_on_id_and_question_code_and_deleted"
    t.index ["id", "question_id", "deleted"], name: "index_campaigns_on_id_and_question_id_and_deleted"
    t.index ["id", "user_id", "deleted", "active"], name: "index_campaigns_on_id_and_user_id_and_deleted_and_active"
    t.index ["id", "user_id", "deleted"], name: "index_campaigns_on_id_and_user_id_and_deleted"
  end

  create_table "clicks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "user_id"
    t.string "controller"
    t.string "action"
    t.string "url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "referrer"
    t.integer "session_info_id"
    t.index ["session_info_id"], name: "index_clicks_on_session_info_id"
  end

  create_table "delayed_jobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "priority", default: 0
    t.integer "attempts", default: 0
    t.text "handler"
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "earls", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.integer "question_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_id"
    t.boolean "active", default: true
    t.string "pass"
    t.string "logo_file_name"
    t.string "logo_content_type"
    t.integer "logo_file_size"
    t.datetime "logo_updated_at"
    t.string "welcome_message", limit: 400
    t.string "default_lang", default: "en"
    t.string "logo_size", default: "medium"
    t.boolean "flag_enabled", default: false
    t.string "ga_code"
    t.boolean "photocracy", default: false
    t.boolean "accept_new_ideas", default: true
    t.string "verify_code"
    t.boolean "show_cant_decide", default: true
    t.boolean "show_add_new_idea", default: true
    t.json "configuration"
    t.index ["question_id"], name: "index_earls_on_question_id"
  end

  create_table "experiments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "test_name"
    t.string "status"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["test_name"], name: "index_experiments_on_test_name"
  end

  create_table "exports", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.binary "data", size: :long
    t.string "name", default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "compressed", default: false
    t.index ["name"], name: "index_exports_on_name"
  end

  create_table "photos", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "image_file_name", default: ""
    t.string "image_content_type", default: ""
    t.integer "image_file_size"
    t.datetime "image_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "rotation", default: 0
    t.string "original_file_name"
  end

  create_table "session_infos", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "session_id"
    t.string "ip_addr"
    t.string "user_agent"
    t.string "loc_info", default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "white_label_request"
    t.integer "visitor_id"
    t.integer "user_id"
    t.string "loc_info_2", default: ""
    t.index ["session_id"], name: "index_session_infos_on_session_id"
  end

  create_table "slugs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.integer "sluggable_id"
    t.integer "sequence", default: 1, null: false
    t.string "sluggable_type", limit: 40
    t.string "scope", limit: 40
    t.datetime "created_at"
    t.index ["name", "sluggable_type", "scope", "sequence"], name: "index_slugs_on_n_s_s_and_s", unique: true
    t.index ["sluggable_id"], name: "index_slugs_on_sluggable_id"
  end

  create_table "trials", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "session_info_id"
    t.integer "alternative_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "email"
    t.string "encrypted_password", limit: 128
    t.string "salt", limit: 128
    t.string "confirmation_token", limit: 128
    t.string "remember_token", limit: 128
    t.boolean "email_confirmed", default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "default", default: false
    t.boolean "admin", default: false
    t.json "configuration"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email"
    t.index ["id", "confirmation_token"], name: "index_users_on_id_and_confirmation_token"
    t.index ["remember_token"], name: "index_users_on_remember_token"
  end

  create_table "visitors", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "remember_token", default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["remember_token"], name: "index_visitors_on_remember_token"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
end
