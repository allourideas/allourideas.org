# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_09_19_132734) do

  create_table "alternatives", force: :cascade do |t|
    t.integer "experiment_id"
    t.string "content", limit: 255
    t.string "lookup", limit: 32
    t.integer "weight", default: 1
    t.integer "participants", default: 0
    t.integer "conversions", default: 0
    t.index ["experiment_id"], name: "index_alternatives_on_experiment_id"
    t.index ["lookup"], name: "index_alternatives_on_lookup"
  end

  create_table "blocked_cookies", force: :cascade do |t|
    t.string "referrer", limit: 255, default: ""
    t.integer "question_id"
    t.string "user_agent", limit: 255, default: ""
    t.string "ip_addr", limit: 255, default: ""
    t.string "source", limit: 255, default: ""
    t.string "session_id", limit: 255, default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["created_at"], name: "index_blocked_cookies_on_created_at"
    t.index ["ip_addr"], name: "index_blocked_cookies_on_ip_addr"
    t.index ["question_id"], name: "index_blocked_cookies_on_question_id"
  end

  create_table "clicks", force: :cascade do |t|
    t.integer "user_id"
    t.string "controller", limit: 255
    t.string "action", limit: 255
    t.string "url", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "referrer", limit: 255
    t.integer "session_info_id"
    t.index ["session_info_id"], name: "index_clicks_on_session_info_id"
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0
    t.integer "attempts", default: 0
    t.text "handler"
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "queue"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "earls", force: :cascade do |t|
    t.string "name", limit: 255
    t.integer "question_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_id"
    t.boolean "active", default: true
    t.string "pass", limit: 255
    t.string "logo_file_name", limit: 255
    t.string "logo_content_type", limit: 255
    t.integer "logo_file_size"
    t.datetime "logo_updated_at"
    t.string "welcome_message", limit: 400
    t.string "default_lang", limit: 255, default: "en"
    t.string "logo_size", limit: 255, default: "medium"
    t.boolean "flag_enabled", default: false
    t.string "ga_code", limit: 255
    t.boolean "photocracy", default: false
    t.boolean "accept_new_ideas", default: true
    t.string "verify_code", limit: 255
    t.boolean "show_cant_decide", default: true
    t.boolean "show_add_new_idea", default: true
    t.string "slug"
    t.index ["question_id"], name: "index_earls_on_question_id"
  end

  create_table "experiments", force: :cascade do |t|
    t.string "test_name", limit: 255
    t.string "status", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["test_name"], name: "index_experiments_on_test_name"
  end

  create_table "exports", force: :cascade do |t|
    t.binary "data", limit: 2147483647
    t.string "name", limit: 255, default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "compressed", default: false
    t.index ["name"], name: "index_exports_on_name"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
  end

  create_table "photos", force: :cascade do |t|
    t.string "image_file_name", limit: 255, default: ""
    t.string "image_content_type", limit: 255, default: ""
    t.integer "image_file_size"
    t.datetime "image_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "rotation", default: 0
    t.string "original_file_name", limit: 255
  end

  create_table "session_infos", force: :cascade do |t|
    t.string "session_id", limit: 255
    t.string "ip_addr", limit: 255
    t.string "user_agent", limit: 255
    t.string "loc_info", limit: 255, default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "white_label_request"
    t.integer "visitor_id"
    t.integer "user_id"
    t.string "loc_info_2", limit: 255, default: ""
    t.index ["session_id"], name: "index_session_infos_on_session_id"
  end

  create_table "slugs", force: :cascade do |t|
    t.string "name", limit: 255
    t.integer "sluggable_id"
    t.integer "sequence", default: 1, null: false
    t.string "sluggable_type", limit: 40
    t.string "scope", limit: 40
    t.datetime "created_at"
    t.index ["name", "sluggable_type", "scope", "sequence"], name: "index_slugs_on_n_s_s_and_s", unique: true
    t.index ["sluggable_id"], name: "index_slugs_on_sluggable_id"
  end

  create_table "trials", force: :cascade do |t|
    t.integer "session_info_id"
    t.integer "alternative_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", limit: 255
    t.string "encrypted_password", limit: 128
    t.string "salt", limit: 128
    t.string "confirmation_token", limit: 128
    t.string "remember_token", limit: 128
    t.boolean "email_confirmed", default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "default", default: false
    t.boolean "admin", default: false
    t.index ["email"], name: "index_users_on_email"
    t.index ["id", "confirmation_token"], name: "index_users_on_id_and_confirmation_token"
    t.index ["remember_token"], name: "index_users_on_remember_token"
  end

  create_table "visitors", force: :cascade do |t|
    t.string "remember_token", limit: 255, default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["remember_token"], name: "index_visitors_on_remember_token"
  end

end
