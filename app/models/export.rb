class Export < ActiveRecord::Base

  # When building CSV exports, we build the data incrementally.
  # This allows us to append to the record.
  # NOTE: This may only work with MySQL
  def self.update_concat(id, data)
    sql = "UPDATE `exports` SET `data` = CONCAT(`data`, '%s') WHERE id = '%s'"
    ActiveRecord::Base.connection.execute sanitize_sql_array([sql, data, id])
  end
end
