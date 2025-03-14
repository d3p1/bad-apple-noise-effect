/**
 * @description App
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 */
import badAppleVideo from '../media/videos/bad-apple.mp4'

class App {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas: HTMLCanvasElement

  /**
   * @type {CanvasRenderingContext2D}
   */
  #context: CanvasRenderingContext2D

  /**
   * @type {HTMLVideoElement}
   */
  #video: HTMLVideoElement

  /**
   * @type {number | null}
   */
  #animationId: number | null = null

  /**
   * Constructor
   */
  constructor() {
    this.#initCanvas()
    this.#initVideo()
  }

  /**
   * Run effect
   *
   * @returns {void}
   */
  #run(): void {
    const oldImgData = this.#getImgData()

    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

    this.#context.drawImage(
      this.#video,
      0,
      0,
      this.#canvas.width,
      this.#canvas.height,
    )

    this.#postProcessing(oldImgData.data)

    this.#animationId = requestAnimationFrame(this.#run.bind(this))
  }

  /**
   * Post-processing effect
   *
   * @param   {Uint8ClampedArray} oldData
   * @returns {void}
   * @note    It is considered that processing data is white and black,
   *          so it is only checked the red channel to validate pixel color
   */
  #postProcessing(oldData: Uint8ClampedArray): void {
    const currentImgData = this.#getImgData()
    const currentData = currentImgData.data

    for (let i = 0; i < currentData.length; i += 4) {
      if (currentData[i] === 0) {
        const noise = this.#generateNoise()
        currentData[i] = noise
        currentData[i + 1] = noise
        currentData[i + 2] = noise
      } else {
        currentData[i] = oldData[i]
        currentData[i + 1] = oldData[i + 1]
        currentData[i + 2] = oldData[i + 2]
      }
    }

    this.#context.putImageData(currentImgData, 0, 0)
  }

  /**
   * Generate noise
   *
   * @returns {void}
   */
  #generateNoise(): number {
    return Math.random() * 255
  }

  /**
   * Play video
   *
   * @returns {void}
   */
  #playVideo(): void {
    this.#video.play().then(() => {
      this.#run()
    })
  }

  /**
   * Pause video
   *
   * @returns {void}
   */
  #pauseVideo(): void {
    if (this.#animationId) {
      cancelAnimationFrame(this.#animationId)
      this.#video.pause()
    }
  }

  /**
   * Init video
   *
   * @returns {void}
   */
  #initVideo(): void {
    this.#video = document.createElement('video')
    this.#video.src = badAppleVideo
    this.#video.muted = true

    this.#video.addEventListener('loadeddata', () => {
      this.#canvas.width = this.#video.videoWidth
      this.#canvas.height = this.#video.videoHeight

      this.#canvas.addEventListener('click', () => {
        if (this.#video.paused) {
          this.#playVideo()
        } else {
          this.#pauseVideo()
        }
      })

      this.#playVideo()
    })
  }

  /**
   * Init canvas
   *
   * @returns {void}
   */
  #initCanvas(): void {
    this.#canvas = document.createElement('canvas')
    this.#context = this.#canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D

    this.#canvas.style.border = '2px solid black'
    document.body.appendChild(this.#canvas)
  }

  /**
   * Get image data
   *
   * @returns {void}
   */
  #getImgData(): ImageData {
    return this.#context.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height,
    )
  }
}

new App()
