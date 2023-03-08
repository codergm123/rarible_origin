module Api
  class Pinata

    attr_reader :base_url, :api_key, :api_secret

    def initialize
      @base_url = Rails.application.credentials.pinata[:base_url]
      @api_key = Rails.application.credentials.pinata[:api_key]
      @api_secret = Rails.application.credentials.pinata[:api_secret]
    end

    def send_file(file)
      res = connection.post(base_url, file: file)
      if res.success?
        res = JSON.parse(res.body, symbolize_names: true)
        return true, res[:IpfsHash]
      else
        return false, res[:IpfsHash]
      end
    end

    def upload(collection)
      attachment = collection.attachment
      file_path = ActiveStorage::Blob.service.send(:path_for, attachment.key)
      content_type = attachment.blob.content_type
      file_io = Faraday::UploadIO.new(file_path, content_type)
      ok, image_ipfs_hash = send_file(file_io)
      return unless ok
      metadata = {
        name: collection.name,
        description: collection.description,
        image: 'https://ipfs.io/ipfs/' + image_ipfs_hash
      }
      File.write("tmp/metadata.json", metadata.to_json)
      metadata_io = Faraday::UploadIO.new("tmp/metadata.json", 'application/json')
      ok, metadata_ipfs_hash = send_file(metadata_io)
      collection.update(image_hash: image_ipfs_hash, metadata_hash: metadata_ipfs_hash)
      ok ? metadata_ipfs_hash : nil
    end

    def connection
      @connection ||= Faraday.new do |f|
        f.request :multipart
        f.request :url_encoded
        f.headers['Content-Type'] = 'multipart/form-data'
        f.headers['pinata_api_key'] = api_key
        f.headers['pinata_secret_api_key'] = api_secret
        f.adapter :net_http
      end
    end
  end
end
