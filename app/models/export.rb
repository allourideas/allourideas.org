class Export < ActiveRecord::Base

  # When building CSV exports, we build the data incrementally.
  # This allows us to append to the record.
  # NOTE: This may only work with MySQL
  def self.update_concat(id, data)
    # use CONCAT_WS so we ignore NULL values
    sql = "UPDATE `exports` SET `data` = CONCAT_WS('', `data`, '%s') WHERE id = '%s'"
    ActiveRecord::Base.connection.execute sanitize_sql_array([sql, data, id])
  end
end
