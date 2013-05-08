require 'csv'

if CSV.const_defined?(:Reader)
  class CSVBridge < FasterCSV
  end
else
  class CSVBridge < CSV
  end
end
